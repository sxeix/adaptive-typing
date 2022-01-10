import { Component, OnInit, ViewChild } from '@angular/core';
import { FlaskService } from '../flask.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  wordset: any;
  wordIndex = 0;
  inputWord = "";
  typedWords: string[] = [];

  constructor(private service: FlaskService) { }

  ngOnInit(): void {
    this.refreshWordset()
  }

  refreshWordset() {
    this.service.randomWordsetRequest().subscribe(i => {
      this.wordset = Object.values(i);
    });
    this.wordIndex = 0;
    console.log(this.wordset);
    this.typedWords = [];
    this.inputWord = "";
  }

  onSpace() {
    if (this.inputWord[0] === " ") {
      this.inputWord = this.inputWord.slice(1);
    }
    this.typedWords.push(this.inputWord);
    this.inputWord = "";
    this.wordIndex++;
    if (this.typedWords.length === this.wordset.length) {
      // This is where we are going to trigger a post request in the flaskservice
      console.log('test completed');
    }
  }

  getColour(currentIndex: number): string {
    const intendedWord = this.wordset[currentIndex];
    const actualWord = this.typedWords[currentIndex];
    if (intendedWord === actualWord) {
      return 'green';
    } else if (actualWord === undefined && currentIndex === this.typedWords.length) {
      return 'grey';
    } else if (actualWord === undefined) {
      return 'white'
    } else if (intendedWord !== actualWord) {
      return 'red';
    }
    return 'white';
  }
}
