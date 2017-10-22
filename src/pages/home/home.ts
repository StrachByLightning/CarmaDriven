import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { computerVisionService } from '../../providers/cognitive-service/computerVisionService'

import 'rxjs/add/operator/toPromise';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { Geolocation } from '@ionic-native/geolocation';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CameraPreview, computerVisionService, TextToSpeech, Geolocation, LocationServiceProvider]
})

export class HomePage {
	public safety = 100;
	private prevSafety = 100;

  constructor(public navCtrl: NavController,
  			private cameraPreview: CameraPreview,
  			private CVS: computerVisionService,
        private locationService: LocationServiceProvider, 
        private geolocation: Geolocation,
  			private tts: TextToSpeech) {
    this.updateSafetySpeech(10000);
  }



  startScanner(): void {
  	const cameraPreviewOpts: CameraPreviewOptions = {
	  x: 0,
	  y: 0,
	  width: window.screen.width,
	  height: window.screen.height,
	  camera: 'rear',
	  tapPhoto: true,
	  previewDrag: true,
	  toBack: false,
	  alpha: 1
	};

	this.cameraPreview.startCamera(cameraPreviewOpts).then(
	  (res) => {
	    console.log(res)
	  },
	  (err) => {
	    console.log(err)
	  });

	const pictureOpts: CameraPreviewPictureOptions = {
	  width: 1280,
	  height: 1280,
	  quality: 85
	}

	var intervalID = setInterval(() => {
		this.analyzePicture(pictureOpts);
	}, 5000);

  	}

  	analyzePicture(pictureOpts): void {
  		this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
	  	var picture = 'data:image/jpeg;base64,' + imageData;
	  	this.CVS.getAlerts(picture)

	  	fetch(picture)
      		.then((response) => {
        		return response.blob()
      	})
      	.then((blob) => {
      		var response = this.CVS.getAlerts(blob)
      		response.toPromise()
      		.then(res => {
      			console.log(res.json())
          		var tts = this.CVS.processData(res.json())
          		if (tts == null){
          			console.log("Nothin")
          		} else {
          			this.tts.speak(tts).catch((reason: any) => console.log(reason))
          			console.log(tts)
          		}
        	});
      	});


		}, (err) => {
		  console.log(err);
		});
  	}

		
	/**
	 * Update this.safety to a non-negative value between 0 - 100 o.w. 
	 * where higher score means higher safety rating.
	 * @method updateSafety
	 */
	updateSafety() {
		let that = this;

		this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 5000}).then(res => {
			this.locationService.getSafety(res.coords.latitude, res.coords.longitude)
			//this.locationService.getSafety(42.326194, -71.092367)
				.subscribe(
					res => {
						let obj = JSON.parse(res["_body"]).totalHomeScores;
						if (!that.isEmpty(obj)) {
							that.prevSafety = that.safety;
							that.safety = obj.safety.value;
						} else {
							that.prevSafety = that.safety;
							that.safety = -1;
						}
					}, err=> {
						console.log(err);
					}
				)
		}, err => {
			console.log(err);
		});
	}

	/**
	 * Run string through text-to-speech.
	 * @method runTTS
	 * @param str - string to run
	 */
	runTTS(str) {
		this.tts.speak(str)
			.then(() => console.log('Success'))
			.catch((reason: any) => console.log(reason));
	}

	/**
	 * Run tts function every x milliseconds.
	 * @method updateSafetySpeech
	 * @param x - milliseconds
	 */
	updateSafetySpeech(x) {
		let that = this;

		setInterval(function() {
			that.updateSafety();
			console.log(that.safety);
			console.log(that.prevSafety);
			if (Math.abs(that.safety - that.prevSafety) > 20) {
				if (that.safety > 75) {
					that.runTTS("Is Safe");
				} else if (that.safety > 50) {
					that.runTTS("Is Average");
				} else if (that.safety > 25) {
					that.runTTS("Is Below Average");
				} else if (that.safety > 0) {
					that.runTTS("Is Unsafe");
				} else {
					that.runTTS("There is no traffic data at you current location.");
				}
			}
		}, x);
	}

	private isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
		}
		
    return JSON.stringify(obj) === JSON.stringify({});
	}
}
