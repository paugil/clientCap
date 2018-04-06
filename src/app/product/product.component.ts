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
  progressbar: any;
  url: String;
  product: Product;
  money: number;
  qMax = 1;
  lastupdate: any
  coutProduct = 0;
  _qtmulti: string;
  serviceRest;

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyAchat: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() notifyProduct: EventEmitter<Product> = new EventEmitter<Product>();

  @Input()
  set prod(value: Product) {
    this.product = value;
    if (this.product)
      this.coutProduct = this.product.cout
  }

  @Input()
  set worldMoney(value: number) {
    this.money = value;
    this.calcMaxCanBuy();
  }

  constructor(private service: RestserviceService) {
    //this.serviceRest=service;
    this.url = service.getServer();
  }

  ngOnInit() {
    this.progressbar = new this.ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 100, color: 'green' });
    setInterval(() => { this.calcScore(); }, 100);
  }

  startFabrication() {
    if (this.product.timeleft == 0) {
      if (this.product.quantite >= 1) {
        this.product.timeleft = this.product.vitesse;
        this.lastupdate = Date.now(); //instant de démarrage de la prod
        this.progressbar.animate(1, { duration: this.product.vitesse });
      }
    }
  }

  onBuy() {
    if (this._qtmulti === "x1")
      this.product.quantite += 1;
      this.product.cout = this.coutProduct;
    if (this._qtmulti === "x10")
      this.product.quantite += 10;
    if (this._qtmulti === "x100")
      this.product.quantite += 100;
    if (this._qtmulti === "xMax")
      this.product.quantite += this.qMax;
    //this.serviceRest.putProduct(this.product);
    this.notifyAchat.emit(this.coutProduct);
    this.notifyProduct.emit(this.product);

  }

  calcScore(): any {

    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      this.lastupdate = Date.now();
      if ( this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
      this.calcMaxCanBuy();
    }
    if (this.product.managerUnlocked == true) {
      this.startFabrication();
    }
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product)
      this.calcMaxCanBuy();
  }

  calcMaxCanBuy(): any {
    if (this._qtmulti === "x1") {
      this.coutProduct = (this.product.cout * this.product.croissance) ;
      this.qMax = 1;
    };
    if (this._qtmulti === "x10") {
      this.coutProduct = this.product.cout * ((1 - this.product.croissance ** (10 + 1)) / (1 - this.product.croissance))
      this.qMax = 10;
    };
    if (this._qtmulti === "x100") {
      this.coutProduct = this.product.cout * ((1 - this.product.croissance ** (100 + 1)) / (1 - this.product.croissance))
      this.qMax = 100;
    };
    if (this._qtmulti === "xMax") {
      this.qMax = (Math.log(1 - (this.money / this.product.cout) * (1 - this.product.croissance)) / (Math.log(this.product.croissance)));
      this.qMax = (Math.trunc(this.qMax));
      this.coutProduct = (this.product.cout * (1 - Math.pow(this.product.croissance, this.qMax))) / (1 - this.product.croissance)
    }
  }

}
