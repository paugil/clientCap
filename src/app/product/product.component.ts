import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { World, Pallier, Product } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],

})

export class ProductComponent implements OnInit {
 
  @ViewChild('bar') progressBarItem

  ProgressBar = require("progressbar.js");
  progressbar : any;
  progress = 1;
  url : String;
  product : Product;
  timeleft;
  lastupdate;
  @Input()
  // @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  
  set prod(value : Product){
    this.product = value;
    console.log(this.product)
  }

  constructor(private service : RestserviceService) { 
    this.url = service.getServer();
  }

  ngOnInit() {
    this.progressbar = new this.ProgressBar.Line(this.progressBarItem.nativeElement, 
      { strokeWidth: 50, color:'#00ff00' });
    setInterval(() => { this.calcScore(); }, 100);
  }

  startFabrication() {
    if(this.product.quantite>=1){
      this.progressbar.animate(1, { duration: this.product.vitesse });
      // this.progressbar.set(this.progress);
    } 
    this.timeleft = this.product.vitesse;
    this.lastupdate = Date.now()
  }

  calcScore(): any {
    if(this.timeleft <= 0){
      this.timeleft = 0;
      this.progressbar.set(0);
    } else {
      this.timeleft = Date.now() - this.lastupdate - this.timeleft;
    }
  }


}
