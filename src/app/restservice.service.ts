import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

  user : string
  server : string

  constructor(private http:Http) { 
    this.server = "http://localhost:8080/serveurCap/";
    this.user = " ";
  }

  getUser() : string {
    return this.user;
  }

  setUser(user : string){
    this.user = user;
  }

  getServer() : string {
    return this.server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world")
    .toPromise().then(response =>response.json()).catch(this.handleError);
  };

}
