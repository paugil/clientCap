import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  world: World = new World();
  server: string;
  Tabmulti = ["x1", "x10", "x100", "xMax"];
  qtmulti = this.Tabmulti[0];
 

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(world => { 
      this.world = world;
    });
  }
  
  onProductionDone(p : Product) {
    this.world.money += p.revenu;
    this.world.score += p.revenu;
  }

  onBuyDone(n : number){
    this.world.money -= n;
    this.world.score -= n;
  }

  defQmulti(){
    if (this.qtmulti === "x1"){
      this.qtmulti = this.Tabmulti[1];
    } else if (this.qtmulti === "x10"){
      this.qtmulti = this.Tabmulti[2];
    } else if (this.qtmulti === "x100"){
      this.qtmulti = this.Tabmulti[3];
    } else if (this.qtmulti === "xMax"){
      this.qtmulti = this.Tabmulti[0];
    }
  }

 
}
