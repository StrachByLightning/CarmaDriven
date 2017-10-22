import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {

  private BASE_URL = "https://apis.solarialabs.com/shine/v1/total-home-scores/reports";
  private API_KEY  = "utciB3iCFmLLn6kbI4KM7qwAJIiGlN28";

  constructor(public http: Http) { }

  /**
   * Get safety rating for lat/lon
   * @method getSafety
   * @param lat latitude
   * @param lon longitude
   * @return score between 0-100 with higher score indicating higher safety.
   */
  getSafety(lat, lon) {
    let body = {
      "lat": lat,
      "lon": lon,
      "apikey": this.API_KEY
    }

    let tempURL = this.BASE_URL + "?lat=" + lat + "&lon=" + lon + "&apikey=" + this.API_KEY;

    return this.http.get(tempURL);
  }

}
