import { Component, OnInit } from '@angular/core';
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
    users: string[] = ["user", "user1", "user2", "testuser"];
    displayCreateOptions = false;
    newUserName = "";

    constructor(private service: FlaskService) { }

    ngOnInit(): void {
        this.refreshWordset();
        this.loadUsers();
        this.kbd = new Keyboard();
        this.kbd.setOptions({
            physicalKeyboardHighlight: true,
            physicalKeyboardHighlightPress: true
        });
        this.service.getUsers().subscribe(
            response => {
                this.users = response['users'];
                this.currentUser = this.users[0];
            }
        )
    }

    changeUser() { 
        this.service.changeUser(this.currentUser).subscribe(
            response => {
                console.log(response);
                if (response['status']) {
                    this.refreshWordset()
                }
            }
        );
    }

    createAccount() {
        console.log('making account under username ' + this.newUserName);
        this.users.push(this.newUserName);
        this.currentUser = this.newUserName;
        this.newUserName = "";
    }

    toggleCreateAccount(element) {
        this.displayCreateOptions = !this.displayCreateOptions;
        element.textContent = this.displayCreateOptions ? "Hide create account" : "Create New Account";
        this.newUserName = "";
    }


    loadUsers() {
        // Code here to load the users that are already available
        console.log('Loading users');
    }

    refreshWordset() {
        this.service.tailoredWordsetRequest(this.currentUser).subscribe(i => {
            this.wordset = Object.values(i["words"]);
            this.focusSet = i["focus_set"];
        })
        console.log(this.focusSet);
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
            this.service.postTestResult(this.typedWords, this.wordset, this.currentUser).subscribe(
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
