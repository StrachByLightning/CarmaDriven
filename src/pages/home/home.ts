import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationServiceProvider } from '../../providers/location-service/location-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
