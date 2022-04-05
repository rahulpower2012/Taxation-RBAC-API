import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Taxation';


  openSignUp() {
    console.log("openSignUp");
  }

  openSignIn() {
    console.log("openSignIn");
  }
}
