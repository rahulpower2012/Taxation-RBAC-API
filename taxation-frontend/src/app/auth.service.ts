import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from "moment";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  async login(email:string, password:string ) {
    try{
      await this.http.post('http://localhost:3000/login', {email, password}).subscribe((res:any)=>{
        console.log(res);
        this.setSession(res);
        console.log(res.data);
        return res;
      });
  }catch(e){
    return e;
  }
}
      
private setSession(authResult:any) {
    // const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem('id', authResult.data.userId);
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
}          

logout() {
    localStorage.removeItem("id_token");
    // localStorage.removeItem("expires_at");
}

public isLoggedIn() {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': String(localStorage.getItem('id_token')) });
let options = { headers: headers };
  this.http.post('http://localhost:3000/', {}, options).subscribe((res:any)=>{});
    // return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
    // return !this.isLoggedIn();
}

getExpiration() {
    const expiration:any = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
}

getUser(){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
  return this.http.get('http://localhost:3000/user/'+localStorage.getItem('id'),options);
}
}
