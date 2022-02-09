import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlaskService } from '../flask.service';
import Keyboard from 'simple-keyboard';

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
    focusSet = [];

    timer: any;
    time = 0;
    started = false;

    kbd: Keyboard;

    currentUser: string = "DEFAULT";
    @Input() startingUser = ''; 
    @Output() userOutput = new EventEmitter<string>();
    users: string[] = ["user", "user1", "user2", "testuser"];
    displayCreateOptions = false;
    newUserName = "";
    wordCount = 30;

    constructor(private service: FlaskService) { }

    ngOnInit(): void {
        this.kbd = new Keyboard();
        this.kbd.setOptions({
            physicalKeyboardHighlight: true,
            physicalKeyboardHighlightPress: true
        });
        this.loadUsers();
    }
    
    loadUsers() {
        this.service.getUsers().subscribe(
            response => {
                this.users = response['users'];
                this.currentUser = this.users[0];
                if (this.startingUser !== '') {
                    this.currentUser = this.startingUser;
                }
                this.refreshWordset();
                this.userOutput.emit(this.currentUser);
            }
        );
    }

    changeUser() { 
        this.service.changeUser(this.currentUser).subscribe(
            response => {
                if (response['status']) {
                    this.refreshWordset();
                }
            }
        );
        this.userOutput.emit(this.currentUser);
    }

    createAccount() {
        console.log('making account under username ' + this.newUserName);
        this.users.push(this.newUserName);
        this.currentUser = this.newUserName;
        this.newUserName = "";
        this.toggleCreateAccount();
        this.refreshWordset();
        this.userOutput.emit(this.currentUser);
    }

    toggleCreateAccount() {
        this.displayCreateOptions = !this.displayCreateOptions;
        this.newUserName = "";
    }

    refreshWordset() {
        this.service.tailoredWordsetRequest(this.currentUser, this.wordCount).subscribe(i => {
            this.wordset = Object.values(i["words"]);
            this.focusSet = i["focus_set"];
        })
        this.wordIndex = 0;
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
            this.service.postTestResult(this.typedWords, this.wordset, this.currentUser, this.getTestStats()).subscribe(
                response => {
                    console.log(response);
                }
            );
        }
    }

    getTestStats(): Object {
        const currentTime = Date();
        var formattedTime = currentTime.toLocaleLowerCase('en-gb');
        const stats = {
            'time': formattedTime,
            'wpm': this.calculateWpm(),
            'cpm': this.calculateCpm(),
            'focus-set': this.focusSet
        }
        return stats;
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
            return '#ffb300';
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
        this.started = false;
    }

    countCorrectCharacters() {
        if (this.wordset.length !== this.typedWords.length) {
            return 0;
        }
        var correctCharacters = 0;
        for (var i = 0; i < this.wordset.length; i++) {
            var expectedWord = this.wordset[i];
            var typedWord = this.typedWords[i];
            for (var x = 0; x < expectedWord.length; x++) {
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
        return Math.round(this.countCorrectCharacters() / (this.time / 60));
    }

    calculateWpm() {
        const chars = this.countCorrectCharacters()
        if (chars === 0) return 0;
        // Average words per minute
        // integer 5 is used to indicate average length of a word
        return Math.round((this.countCorrectCharacters() / 5) / (this.time / 60));
    }

    formatFocusSet() {
        let formattedFocusSet = []
        if (this.focusSet) {
            for (var i = 0; i < this.focusSet.length; i++) {
                formattedFocusSet.push(" " + this.focusSet[i][0] + this.focusSet[i][1]);
            }
        }
        return formattedFocusSet;
    }
}
