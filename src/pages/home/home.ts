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
	private safety = 0;

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
	
	getSafety() {
		this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 5000}).then(res => {
			this.locationService.getSafety(res.coords.latitude, res.coords.longitude)
				.subscribe(
					res => {
						this.safety = res.totalHomeScores.safety.value;
					}, err=> {
						console.log(err);
					}
				)
		});
	}
}
