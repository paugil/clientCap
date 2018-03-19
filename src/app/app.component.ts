import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { Http } from '@angular/http';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  // private tService;
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
    // this.tService = toasterService;
  }
  
  onProductionDone(p : Product) {
    this.world.money += p.revenu;
    this.world.score += p.revenu;
  }

  onBuyDone(n : number){
    this.world.money -= n;
    this.world.score -= n;
  }

  hireManager(manager : Pallier){
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[(manager.idcible)-1].managerUnlocked = true;
    // this.tService.pop('success', 'Manager hired !', manager.name);

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
