import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class computerVisionService {

  constructor(public http: Http) { }

  getAlerts(base64Image) {
    const body = {
      "body": base64Image
    };
    // make the application key an env var when we can
    let headers = new Headers({ 'Content-Type': 'application/json', 'Prediction-Key' : 'edd3305821f746ef8702558ef984cb97'})
    let options = new RequestOptions({ headers: headers })

    var response = this.http.post('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/4308642c-585f-456f-8d73-aa343a4e624e/url?iterationId=8cabf572-dea4-4295-8d76-f42171077722', body, options)

    // for(prediction in response.Prediction){
    //   if (prediction.Tag == "pedstrian" && prediction.Probability > .8){
    //     return "Pedestrians ahead";
    //   }
    //   else if(prediction.Tag == "stop_sign" && prediction.Probability > .8){
    //     return "Stop sign ahead";
    //   }
    //   else if(prediction.Tag == "red_light" && prediction.Probability > .8){
    //     return "Red light ahead";
    //   }
    // }

    return null;
  }

}
