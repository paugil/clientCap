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
  coutProduct : number;
  _qtmulti: string;
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyAchat: EventEmitter<Number> = new EventEmitter<Number>();  
  
  @Input()
  set prod(value : Product){
    this.product = value;
    if(this.product)
      this.coutProduct = this.product.cout
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

  condition(){
    console.log("test")
    return true;
  }

  startFabrication() {
    if(this.product.quantite>=1){
      this.etatProduc = 1;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.progressbar.set(this.progress);
    } 
    console.log(this.product.timeleft);
    this.timeleft = this.product.vitesse;
    this.lastupdate = Date.now()
  }

  onBuy() {
    this.notifyAchat.emit(this.coutProduct);
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
    this._qtmulti = value;
    if (this._qtmulti && this.product) 
        this.calcMaxCanBuy();
  }

  calcMaxCanBuy(): any {
    if(this._qtmulti === "x1"){
      this.coutProduct = this.product.cout
    };
    if(this._qtmulti === "x10"){
      this.coutProduct = this.product.cout * ((1-this.product.croissance ** (10+1))/(1-this.product.croissance))
    };
    if(this._qtmulti === "x100"){
      this.coutProduct = this.product.cout * ((1-this.product.croissance ** (100+1))/(1-this.product.croissance))
    };
    if(this._qtmulti === "xMax"){
    //en fonction de la valeur _qtmulti on calcule le cout de l'achat, penser à afficher la valeur pour le parent
      var qMax = 0;
      while (this.money > this.product.cout * ((1-this.product.croissance ** (qMax+1))/(1-this.product.croissance))){
        qMax += 1 ;
      }
      this.coutProduct = this.coutProduct = this.product.cout * ((1-this.product.croissance ** (qMax+1))/(1-this.product.croissance))
    }
}

}
