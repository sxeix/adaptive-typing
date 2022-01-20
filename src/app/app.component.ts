import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'adaptive-typing';
    displayStats = false;
    currentUser = '';
    constructor() { }

    statsToggle() {
        this.displayStats = !this.displayStats;
    }

    changeUser(user) {
        this.currentUser = user;
    }
}
