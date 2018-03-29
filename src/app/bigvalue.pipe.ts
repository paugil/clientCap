import { Pipe, PipeTransform } from '@angular/core';
import { HtmlParser } from '@angular/compiler';
import { element } from 'protractor';

@Pipe({
  name: 'bigvalue'
})
export class BigvaluePipe implements PipeTransform {

  transform(valeur: number, args?: any): string {
    let res : string;
    let tab : ["millions", "billions", "trillions", "quadrillions","quintillions","sextillions","septillions"];
    if (valeur < 1000)
    res = valeur.toFixed(2);
    else if (valeur < 1000000)
    res = valeur.toFixed(0);
    else if (valeur >= 1000000) {
    res = valeur.toPrecision(4);
    res = res.replace(/e\+(.*)/, "10<sup>$1</sup>");
  }

  
    return res;
  }

}
