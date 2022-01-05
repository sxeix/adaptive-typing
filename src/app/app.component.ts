import { Component } from '@angular/core';
import { FlaskService } from './flask.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adaptive-typing';
  response: any;

  constructor(private service: FlaskService) {  }

  ngOnInit() {
    this.basicGetRequest();
  }

  basicGetRequest() {
    this.service.basicRequest().subscribe(i => {this.response = i})
  }

  buttonClicked() {
    console.log(this.response);
  }

}
