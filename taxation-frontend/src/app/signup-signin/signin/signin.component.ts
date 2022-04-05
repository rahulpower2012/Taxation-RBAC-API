import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  user:any;
  loginFailed:any = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }
  signin = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)
  });

  ngOnInit(): void {
  }

  async onLogin(){
    this.loginFailed = false;
    console.log(this.signin.value);
    let loginResponse:any = await this.authService.login(this.signin.value.email, this.signin.value.password);
    // if(loginResponse){

      // this.user = loginResponse.user;
      await this.getUser();
      console.log("this data"+this.user);
      
    // }else{
    //   this.loginFailed = true;
    // }

    console.log(this.user);

  }

  async getUser(){
    await this.authService.getUser().subscribe(async (res: any) => {
      
      // this.user = await JSON.parse(JSON.stringify(res.data));
      // return this.user;
      this.user = await res.data;
      console.log(res.data.role);
      await this.router.navigateByUrl(`/dashboard/${res.data.role}`, { state: this.user });
    })
  }

}
