import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { computerVisionService } from '../../providers/cognitive-service/computerVisionService'
import { TextToSpeech } from '@ionic-native/text-to-speech'

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CameraPreview, computerVisionService, TextToSpeech]
})
export class HomePage {

  constructor(public navCtrl: NavController,
  			private cameraPreview: CameraPreview,
  			private CVS: computerVisionService,
  			private tts: TextToSpeech) {

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

}
