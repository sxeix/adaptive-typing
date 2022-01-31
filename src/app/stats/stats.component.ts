import { Component, Input, OnInit } from '@angular/core';
import { FlaskService } from '../flask.service';
import { Chart } from 'angular-highcharts';

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
    userCurrentSkill = '';

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
            },
            plotBands: [
                {
                    from: 0,
                    to: 20,
                    color: 'rgba(245, 167, 66, 0.1)',
                    label : { text: 'Newbie' }
                },
                {
                    from: 20,
                    to: 40,
                    color: 'rgba(0,0,0,0)',
                    label : { text: 'Beginner' }
                },
                {
                    from: 40,
                    to: 60,
                    color: 'rgba(245, 167, 66, 0.1)',
                    label : { text: 'Intermediate' }
                },
                {
                    from: 60,
                    to: 80,
                    color: 'rgba(0,0,0,0)',
                    label : { text: 'Proficient' }
                },
                {
                    from: 80,
                    to: 100,
                    color: 'rgba(245, 167, 66, 0.1)',
                    label : { text: 'Skilled' }
                },
                {
                    from: 100,
                    to: 120,
                    color: 'rgba(0,0,0,0)',
                    label : { text: 'Experienced' }
                },
                {
                    from: 120,
                    to: 200,
                    color: 'rgba(245, 167, 66, 0.1)',
                    label : { text: 'Expert' }
                },
            ]
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
        const statsLength = this.userStatistics.length;
        for(var i = 0; i < statsLength; i++) {
            var currentStat = this.userStatistics[i];
            var date = Date.parse(currentStat['time']);
            this.wpmChart.addPoint([date, currentStat['wpm']]);
        }
    }

    plotCpmPoint() {
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
        if (this.userStatistics.length === undefined) {
            return;
        }
        this.userStatistics.forEach(element => {
            averageWpm = averageWpm + element['wpm'];
            averageCpm = averageCpm + element['cpm'];
        });
        averageWpm = Math.round(averageWpm / this.userStatistics.length);
        this.averageWpmString =  'Average wpm: ' + averageWpm;

        averageCpm = Math.round(averageCpm / this.userStatistics.length);
        this.averageCpmString =  'Average cpm: ' + averageCpm;
        var skillLevel = '';
        if (averageWpm === 0) {
            return;
        }
        if (averageWpm < 20) {
            skillLevel = 'Newbie';
        } else if (averageWpm < 40) {
            skillLevel = 'Beginner';
        } else if (averageWpm < 60) {
            skillLevel = 'Intermediate';
        } else if (averageWpm < 80) {
            skillLevel = 'Proficient';
        } else if (averageWpm < 100) {
            skillLevel = 'Skilled';
        } else if (averageWpm < 120) {
            skillLevel = 'Experienced';
        } else if (averageWpm < 200) {
            skillLevel = 'Expert';
        }
        this.userCurrentSkill = 'Skill level: ' + skillLevel;
    }

}
