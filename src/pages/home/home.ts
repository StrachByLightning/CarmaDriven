import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationServiceProvider } from '../../providers/location-service/location-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [[CameraPreview]]
})


export class HomePage {

	constructor(public navCtrl: NavController, private cameraPreview: CameraPreview) { }
	

	startScanning() {		
		const cameraPreviewOpts: CameraPreviewOptions = {
			x: 0,
			y: 0,
			width: window.screen.width,
			height: window.screen.height,
			camera: 'front',
			toBack: true,
			tapPhoto: false,
			previewDrag: false
		};

		this.cameraPreview.startCamera(cameraPreviewOpts).then(
		  (res) => {
		    console.log(res)
		  },
		  (err) => {
		    console.log(err)
		  });
	}

}
