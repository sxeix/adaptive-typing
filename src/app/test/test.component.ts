import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, timer } from 'rxjs';
import { FlaskService } from '../flask.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  wordset: string[] = [];
  wordIndex = 0;
  inputWord = "";
  typedWords: string[] = [];

  timer: any;
  time = 0;
  started = false;

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
    this.stopTimer();
  }

  onSpace() {
    if (this.inputWord[0] === " ") {
      // This logic is needed to avoid having a space at the start of a string
      // this happens due to the use of keydown.Space, 
      // if a space occurs once at the start it is not the user's fault
      this.inputWord = this.inputWord.slice(1);
    }
    this.typedWords.push(this.inputWord);
    this.inputWord = "";
    this.wordIndex++;
    if (this.typedWords.length === this.wordset.length) {
      console.log('test completed');
      this.stopTimer();
      this.service.postTestResult(this.typedWords, this.wordset).subscribe(
        response => { 
          console.log(response); 
        }
      );
    }
  }

  onKey() {
    if (!this.started && this.wordIndex === 0) {
      this.startTimer();
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

  startTimer() {
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
    this.started = true;
    this.time = 0;
  }

  stopTimer() {
    clearInterval(this.timer);
    console.log(this.time);
    this.started = false;
  }


  countCorrectCharacters() {
    if (this.wordset.length !== this.typedWords.length) {
      return 0;
    }
    var correctCharacters = 0;
    var totalCharacters = 0;
    for (var i = 0; i < this.wordset.length; i++) {
      var expectedWord = this.wordset[i];
      var typedWord = this.typedWords[i];
      for (var x = 0; x < expectedWord.length; x++) {
        totalCharacters++;
        if (expectedWord[x] === typedWord[x]) {
          correctCharacters++;
        }
      }
    }
    return correctCharacters
  }

  calculateCpm() {
    const chars = this.countCorrectCharacters()
    if (chars === 0) return 0;
    return Math.round(this.countCorrectCharacters()/(this.time/60));
  }

  calculateWpm() {
    const chars = this.countCorrectCharacters()
    if (chars === 0) return 0;
    // Average words per minute
    // integer 5 is used to indicate average length of a word
    return Math.round((this.countCorrectCharacters()/5)/(this.time/60));
  }

}
