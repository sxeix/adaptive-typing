import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { StatsComponent } from './stats/stats.component';
import { ChartModule } from 'angular-highcharts';
import { InfoComponent } from './info/info.component';

@NgModule({
    declarations: [
        AppComponent,
        TestComponent,
        StatsComponent,
        InfoComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ChartModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
