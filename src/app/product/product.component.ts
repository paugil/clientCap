import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { World, Pallier, Product } from '../world';
import { RestserviceService } from '../restservice.service';
declare var require: any;

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
  money : number;
  etatProduc = 0;
  @Input()
  timeleft;
  lastupdate;
  _qtmulti: string;
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  
  
  @Input()
  set prod(value : Product){
    this.product = value;
  }

  @Input()
  set worldMoney(value : number){
    this.money = value;
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
      this.etatProduc = 1;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.progressbar.set(this.progress);
    } 
    this.timeleft = this.product.vitesse;
    this.lastupdate = Date.now()
  }

  calcScore(): any {
    if(this.timeleft <= 0){
      this.timeleft = 0;
      this.progressbar.set(0);  
      if (this.etatProduc == 1){
        this.notifyProduction.emit(this.product);
        this.etatProduc = 2;
      }
    } else {
      this.timeleft = Date.now() - this.lastupdate - this.timeleft;
    }
  }

  @Input()
  set qtmulti(value: string) {
    console.log(value);
    this._qtmulti = value;
    if (this._qtmulti && this.product) 
        this.calcMaxCanBuy();
  }

  calcMaxCanBuy(): any {
    //en fonction de la valeur _qtmulti on calcule le cout de l'achat, penser à afficher la valeur pour le parent
    var qMax = 0;
    while (this.money > this.prod.cout * ((1-this.prod.croissance ** (qMax+1))/(1-this.prod.croissance))){
      qMax += 1 ;
    }
    console.log(qMax)
  }

}
