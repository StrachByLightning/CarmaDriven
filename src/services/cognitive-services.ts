import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../../environment';

@Injectable()
export class cloudVisionService {

  constructor(public http: Http) { }

  getText(base64Image) {
    const body = {
      "body": base64Image
    };
    // make the application key an env var when we can
    let headers = new Headers({ 'Content-Type': 'application/json', 'Prediction-Key' : 'edd3305821f746ef8702558ef984cb97'})
    let options = new RequestOptions({ headers: headers })

    return this.http.post('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/4308642c-585f-456f-8d73-aa343a4e624e/image?iterationId=73cdf989-245a-487b-963b-0e7a148a0b4a', body, options)

    //return this.http.post('https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags&subscription-key=cc9c64b82a044e9191baeceb2229f34b', body);
  }

}
