import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../flask.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  wordset: any;

  constructor(private service: FlaskService) { }

  ngOnInit(): void {
    this.refreshWordset()
  }

  refreshWordset() {
    this.service.randomWordsetRequest().subscribe(i => {this.wordset = Object.values(i)});
    console.log(this.wordset);
  }

}
