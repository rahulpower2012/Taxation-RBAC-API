import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private http: HttpClient) { }

  signup = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)
  });

  ngOnInit(): void {
  }

  onSignup(){
    console.log(this.signup.value);
    this.http.post(`http://localhost:3000/signup`, this.signup.value)
    .subscribe((res)=>{
      console.log(res);
    });
  }

}
