import { Component, OnInit, Input } from '@angular/core';
import { World, Pallier, Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product : Product;
  @Input()

  set prod(value : Product){
    this.product = value;
    console.log(this.product)
  }

  constructor() { }

  ngOnInit() {
  }

}
