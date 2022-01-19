import { Component, Input, OnInit } from '@angular/core';
import { FlaskService } from '../flask.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

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

    wpmChart = new Chart({
        chart: {
          type: 'line',
          height: '350px'
        },
        title: {
          text: 'Words Per Minute (WPM) over time'
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: "current user's wpm",
            type: 'line'
          }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%a %d %b %H:%M:%S'
            },
            ordinal: true
        },
        yAxis: {
            title:{
                text: 'WPM'
            }
        }
      });

      cpmChart = new Chart({
        chart: {
          type: 'line',
          height: '350px'
        },
        title: {
          text: 'Characters Per Minute (CPM) over time'
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: "current user's cpm",
            type: 'line'
          }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%a %d %b %H:%M:%S'
            },
            ordinal: true
        },
        yAxis: {
            title:{
                text: 'CPM'
            }
        }
      });
      
    constructor(private service: FlaskService) { }
    
    ngOnInit(): void {
        this.getStatistics();
    }

    plotWpmPoint() {
        console.log(this.userStatistics);
        const statsLength = this.userStatistics.length;
        for(var i = 0; i < statsLength; i++) {
            var currentStat = this.userStatistics[i];
            var date = Date.parse(currentStat['time']);
            this.wpmChart.addPoint([date, currentStat['wpm']]);
        }
    }

    plotCpmPoint() {
        console.log(this.userStatistics);
        const statsLength = this.userStatistics.length;
        for(var i = 0; i < statsLength; i++) {
            var currentStat = this.userStatistics[i];
            var date = Date.parse(currentStat['time']);
            this.cpmChart.addPoint([date, currentStat['cpm']]);
        }
    }

    getStatistics() {
        if (this.user !== '') {
            this.service.getUserStats(this.user).subscribe(response => {
                this.userStatistics = response['stats'];
                this.averageStats();
                this.plotWpmPoint();
                this.plotCpmPoint();
            })
        }
    }

    averageStats() {
        let averageWpm = 0;
        let averageCpm = 0;
        this.userStatistics.forEach(element => {
            averageWpm = averageWpm + element['wpm'];
            averageCpm = averageCpm + element['cpm'];
        });
        averageWpm = averageWpm / this.userStatistics.length;
        this.averageWpmString =  'Average wpm: ' + Math.round(averageWpm);

        averageCpm = averageCpm / this.userStatistics.length;
        this.averageCpmString =  'Average cpm: ' + Math.round(averageCpm);
    }

}
