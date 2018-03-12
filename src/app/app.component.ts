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

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(world => { 
      this.world = world;
    }
  );
  }
}
