import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

  user : string
  server : string

  constructor(private http:Http) { 
    this.server = "http://localhost:8080/serveurCap/";
    this.user = null;
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

  private setHeaders(user : string) : Headers {
    var headers = new Headers();
    headers.append("X-User", user);   
    return headers;
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world", {headers: this.setHeaders(this.user)})
    .toPromise().then(response =>response.json()).catch(this.handleError);
  }

  putManager(manager : Pallier) : Promise<Response> {
    console.log("put manager");
    console.log(manager);
    return this.http.put(this.server + "webresources/generic/manager", manager, {headers: this.setHeaders(this.user)})
    .toPromise();
  }

  putProduct(product : Product) : Promise<Response> {
    console.log("put produit");
    console.log(product);
    return this.http.put(this.server + "webresources/generic/product", product, {headers: this.setHeaders(this.user)})
    .toPromise();
  }

  putAngel(angel : Pallier) : Promise<Response> {
    console.log("put angel");
    console.log(angel);
    return this.http.put(this.server + "webresources/generic/angel", angel, {headers: this.setHeaders(this.user)})
    .toPromise();
  }

  putUpgrade(upgrade : Pallier) : Promise<Response> {
    console.log("put upgrade");
    console.log(upgrade);
    return this.http.put(this.server + "webresources/generic/upgrade", upgrade, {headers: this.setHeaders(this.user)})
    .toPromise();
  }

  Reset (world : World) : Promise<Response> {
    return this.http.delete(this.server + "webresources/generic/reset", {headers: this.setHeaders(this.user)})
    .toPromise();
  }
  

}