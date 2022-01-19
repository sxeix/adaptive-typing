import { Component, Input, OnInit } from '@angular/core';
import { FlaskService } from '../flask.service';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

    @Input() user = '';

    userStatistics: Object[];

    averageWpmString = '';
    averageCpmString = '';
    
    constructor(private service: FlaskService) { }

    ngOnInit(): void {
        this.getStatistics();
    }

    getStatistics() {
        if (this.user !== '') {
            this.service.getUserStats(this.user).subscribe(response => {
                console.log(response);
                this.userStatistics = response['stats'];
                this.averageStats();
            })
        }
    }

    averageStats() {
        let averageWpm = 0;
        let averageCpm = 0;
        this.userStatistics.forEach(element => {
            console.log(element['wpm']);
            averageWpm = averageWpm + element['wpm'];
            averageCpm = averageCpm + element['cpm'];
        });
        averageWpm = averageWpm / this.userStatistics.length;
        this.averageWpmString =  'Average wpm: ' + Math.round(averageWpm);

        averageCpm = averageCpm / this.userStatistics.length;
        this.averageCpmString =  'Average cpm: ' + Math.round(averageCpm);
    }

}
