import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'adaptive-typing';
    currentUser = '';
    currentDisplayPageNum = 0;

    constructor() { }

    pageToggle(page: number) {
        if (this.currentDisplayPageNum === page) {
            this.currentDisplayPageNum = 0;
        } else {
            this.currentDisplayPageNum = page;
        }
    }

    changeUser(user) {
        this.currentUser = user;
    }
}
