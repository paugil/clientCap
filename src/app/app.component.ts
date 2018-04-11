import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { Http } from '@angular/http';
import { ToasterModule, ToasterService, ToasterContainerComponent } from 'angular5-toaster';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  tService;
  title = 'app';
  world: World = new World();
  server: string;
  Tabmulti = ["x1", "x10", "x100", "xMax"];
  qtmulti = this.Tabmulti[0];
  badgeManagers = "";
  badgeUnlocks = "";
  badgeCashUpgrades = "";
  badgeAngelsUpgrades = "";
  username : string;
  serviceRest;
  unlocksProduct = [];
  nbAngels = 0;
  bonusvitesse = [];

  constructor(private service: RestserviceService, private toasterService : ToasterService) {
    
    if(localStorage.getItem("username")){
      this.username = localStorage.getItem("username")
    }else{
      this.username = "France" + Math.floor(Math.random() * 10000);
    } 
   
    this.serviceRest = service;
    this.serviceRest.setUser(this.username);
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
      this.tService = toasterService;
      this.viewBadge();
      this.calcNbAnge();
     
    });
  }
  
  onProductionDone(p : Product) {
    this.world.money += (p.revenu)*(p.quantite);
    this.world.score += (p.revenu)*(p.quantite);
    this.viewBadge();
    this.calcNbAnge()
  }

  onBuyDone(n : number){
    this.world.money -= n;
    this.world.score -= n;
    this.calcNbAnge()
    this.viewBadge();
  }
  
  onBuyProduct(p: Product){
    this.service.putProduct(p);
    this.checkUnlocks();
  }

  unlockByProduct(any){
    any.forEach(unlock => {
      this.unlocksProduct.push(unlock);  
    })
  }

  hireManager(manager : Pallier){
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[(manager.idcible)-1].managerUnlocked = true;
    this.tService.pop('success', 'Manager hired !', manager.name);
    this.viewBadge();
    this.service.putManager(manager);
  }
 
  buyUpgrade(upgrade : Pallier){
    this.world.money -= upgrade.seuil;
    upgrade.unlocked = true;
    if(upgrade.idcible>0){
      if(upgrade.typeratio=='GAIN'){
        this.world.products.product[(upgrade.idcible)-1].revenu = this.world.products.product[(upgrade.idcible)-1].revenu * upgrade.ratio * this.world.products.product[(upgrade.idcible)-1].quantite;
      }
      if(upgrade.typeratio=='VITESSE'){
        this.world.products.product[upgrade.idcible-1].vitesse = this.world.products.product[upgrade.idcible-1].vitesse / upgrade.ratio;
      }
    }
    if(upgrade.idcible==0){
      this.world.products.product.forEach(product=>{
        if(upgrade.typeratio=='GAIN'){
          product.revenu = product.revenu * upgrade.ratio * product.quantite;
        }
        if(upgrade.typeratio=='VITESSE'){
          product.vitesse = product.vitesse / upgrade.ratio;
        }
      })
    }
    if(upgrade.idcible==-1){
      this.world.angelbonus += upgrade.ratio; 
    }
    this.tService.pop('success', 'Upgrade buy !', upgrade.name);
    this.viewBadge();
    this.service.putUpgrade(upgrade);    
  };

  buyAngel(angel : Pallier){
    this.world.activeangels -= angel.seuil;
    angel.unlocked = true;
    if(angel.idcible>0){
      if(angel.typeratio=='GAIN'){
        this.world.products.product[(angel.idcible)-1].revenu = this.world.products.product[(angel.idcible)-1].revenu * angel.ratio * this.world.products.product[(angel.idcible)-1].quantite;
      }
      if(angel.typeratio=='VITESSE'){
        this.world.products.product[angel.idcible-1].vitesse = this.world.products.product[angel.idcible-1].vitesse / angel.ratio;
      }
    }
    if(angel.idcible==0){
      this.world.products.product.forEach(product=>{
        if(angel.typeratio=='GAIN'){
          product.revenu = product.revenu * angel.ratio * product.quantite;
        }
        if(angel.typeratio=='VITESSE'){
          product.vitesse = product.vitesse / angel.ratio;
        }
      })
    }
    if(angel.idcible==-1){
      this.world.angelbonus += angel.ratio ; 
    }
    this.tService.pop('success', 'Angel buy !', angel.name);
    this.viewBadge();
    this.service.putAngel(angel);    
  }

  checkUnlocks(){
    var counter = 0 ;
    var unlockUnlocked = [];
    this.world.allunlocks.pallier.forEach(unlock => {
      counter = 0;
      this.world.products.product.forEach(prod => {
        if (prod.quantite>=unlock.seuil){
          counter = counter +1
        }
        console.log(counter)
        if(counter==6){
          unlockUnlocked.push(unlock);  
          if(unlock.typeratio=='GAIN'){        
            prod.revenu = prod.revenu * unlock.ratio * prod.quantite
          }
          if(unlock.typeratio=='VITESSE'){
            prod.vitesse = prod.vitesse / unlock.ratio;
          }        
        }   
      }); 
    });
    this.unlocksProduct.forEach(unlock => {
      if (this.world.products.product[unlock.idcible-1].quantite>=unlock.seuil && unlock.unlocked==false){
        unlock.unlocked=true; 
        this.tService.pop('success', 'Unlock unlocked !', unlock.name);
        if(unlock.typeratio=='GAIN'){        
          this.world.products.product[unlock.idcible-1].revenu = this.world.products.product[unlock.idcible-1].revenu * unlock.ratio * this.world.products.product[unlock.idcible-1].quantite
        }
        if(unlock.typeratio=='VITESSE'){
          this.world.products.product[unlock.idcible-1].vitesse = this.world.products.product[unlock.idcible-1].vitesse / unlock.ratio;
        }        
      }    
    });
    unlockUnlocked.forEach(elt => {
      elt.unlocked = true;
      this.tService.pop('success', 'Unlock unlocked !', elt.name); 
    })   
  }

  calcNbAnge(){
    this.nbAngels = Math.floor(150 * Math.sqrt(this.world.score / Math.pow(10, 5))) - this.world.totalangels;
  }

  viewBadge(){
    this.badgeCashUpgrades="";
    this.badgeManagers="";
    this.badgeAngelsUpgrades="";
    for (let manager of this.world.managers.pallier) {
      if(this.world.money>= manager.seuil && manager.unlocked === false)
        this.badgeManagers = "New";
    }
    for (let upgrade of this.world.upgrades.pallier) {
      if(this.world.money>= upgrade.seuil && upgrade.unlocked === false)
        this.badgeCashUpgrades = "New";
    }
    for (let angel of this.world.angelupgrades.pallier) {
      if(this.world.activeangels>= angel.seuil && angel.unlocked === false)
        this.badgeAngelsUpgrades = "New";
    }    
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

  onUsernameChanged(){
    localStorage.setItem("username", this.username);
    this.serviceRest.setUser(this.username);
    this.serviceRest.getWorld();
    window.location.reload();
  }

  restartWorld(){
    this.serviceRest.Reset().then(world => {
      this.world = world;
    });
    window.location.reload();
  }
 
}