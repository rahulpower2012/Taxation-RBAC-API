import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import  { Location } from '@angular/common';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-taxp-dashboard',
  templateUrl: './taxp-dashboard.component.html',
  styleUrls: ['./taxp-dashboard.component.scss']
})
export class TaxpDashboardComponent implements OnInit {

  user:any;
  constructor(private http: HttpClient, private location: Location, private authService: AuthService) {
    this.user = this.location.getState();
    this.getUser();
  }
  
  filetax = new FormGroup({
    salary: new FormControl('',Validators.required),
    stocks: new FormControl('',Validators.required),
    others: new FormControl('',Validators.required),
  });

  paytax = new FormGroup({
    amount: new FormControl('',Validators.required),
  });

  ngOnInit(): void {
  }


  onFileTax(){
    console.log(this.filetax.value);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
      let inc = {salary: this.filetax.value.salary, stocks: this.filetax.value.stocks, other: this.filetax.value.others};
    this.http.put('http://localhost:3000/user/'+localStorage.getItem('id')+"/file-tax",{income: inc},options).subscribe((data: any) => {
      console.log(data);
      this.user.file = true;
    })
  }

  onPay(){
    console.log(this.paytax.value);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': String(localStorage.getItem('id_token')) });
  let options = { headers: headers };
      try{
        this.http.put('http://localhost:3000/user/'+localStorage.getItem('id')+"/pay-tax",{amount: this.user.tax},options).subscribe((data: any) => {
          console.log(data);
          this.user.paid = data.data.paid;

        })
      }
      catch(e){
        console.log(e);
      }
  }

  getUser(){
    this.authService.getUser().subscribe((data: any) => {
      console.log(data);
      this.user = data.data;
      console.log(this.user.paid);
    })
  }
}
