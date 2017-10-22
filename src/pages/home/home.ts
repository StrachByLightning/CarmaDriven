import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import {Geolocation} from '@ionic-native/geolocation';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CameraPreview, Geolocation]
})
export class HomePage {
	public safety = -1;

	constructor(public navCtrl: NavController, private cameraPreview: CameraPreview, 
		private locationService: LocationServiceProvider, private geolocation: Geolocation) { }
	
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
	}
	
	/**
	 * Update this.safety to a non-negative value between 0 - 100 o.w. 
	 * where higher score means higher safety rating.
	 * @method setSafety
	 */
	updateSafety() {
		this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 5000}).then(res => {
			this.locationService.getSafety(res.coords.latitude, res.coords.longitude)
			//this.locationService.getSafety(42.326194, -71.092367)
				.subscribe(
					res => {
						let obj = JSON.parse(res._body).totalHomeScores;

						if (!this.isEmpty(obj))
							this.safety = obj.safety.value;
						else
							this.safety = -1;

						console.log(this.safety);
					}, err=> {
						console.log(err);
					}
				)
		});
	}

	private isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
		}
		
    return JSON.stringify(obj) === JSON.stringify({});
	}
}
