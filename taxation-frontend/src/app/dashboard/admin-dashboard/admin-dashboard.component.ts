import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  salary!: number;
  stocks!: number;
  others!: number;
  currentUser!:any;
  users:any;

  constructor(private http: HttpClient) { 
    this.getUsers();
  }

  ngOnInit(): void {
  }

  calculateTax(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
    this.http.put('http://localhost:3000/user/'+id+"/calculate-tax",{},options).subscribe((data: any) => {
      console.log(data);
      this.getUsers();
    })
  }

  deleteUser(){

  }

  getUsers(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
    this.http.get('http://localhost:3000/users',options).subscribe((data: any) => {
      console.log(data);
      this.users = data.data;
    })
  }

  makeTaxAc(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
    this.http.put('http://localhost:3000/user/'+id,{role: "tax-ac"},options).subscribe((data: any) => {
      console.log(data);
      this.getUsers();
    })
  }
  makeAdmin(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
    this.http.put('http://localhost:3000/user/'+id,{role: "admin"},options).subscribe((data: any) => {
      console.log(data);
      this.getUsers();
    })
  }
  
}
