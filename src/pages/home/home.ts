import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

}
