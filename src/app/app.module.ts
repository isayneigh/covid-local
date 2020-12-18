import { AboutComponent } from './components/about/about.component';
import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { DesktopDashboardComponent } from './components/desktop-dashboard/desktop-dashboard.component';
import { DesktopFooterComponent } from './components/desktop-footer/desktop-footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HeaderCardComponent } from './components/desktop-dashboard/header-card/header-card.component';
import { HttpClientModule } from '@angular/common/http';
import { LinearGraphInfoCardComponent } from './components/desktop-dashboard/linear-graph-info-card/linear-graph-info-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { PieChartInfoCardComponent } from './components/desktop-dashboard/pie-chart-info-card/pie-chart-info-card.component';
import {
  QuickStatisticsInfoCardComponent
} from './components/desktop-dashboard/quick-statistics-info-card/quick-statistics-info-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SkyNumericModule } from '@skyux/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { KnownIssuesComponent } from './components/known-issues/known-issues.component';
import { ErrorComponent } from './components/error/error.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';

@NgModule({
  entryComponents: [
    AboutComponent,
    ErrorModalComponent,
    KnownIssuesComponent
  ],
  declarations: [
    AppComponent,
    ToolbarComponent,
    DesktopDashboardComponent,
    HeaderCardComponent,
    LinearGraphInfoCardComponent,
    PieChartInfoCardComponent,
    QuickStatisticsInfoCardComponent,
    DesktopFooterComponent,
    AboutComponent,
    KnownIssuesComponent,
    ErrorComponent,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatCardModule,
    NgxChartsModule,
    MatDividerModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    ScrollingModule,
    MatSelectModule,
    ChartsModule,
    MatExpansionModule,
    MatDialogModule,
    SkyNumericModule
  ],
  exports: [
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatCardModule,
    SkyNumericModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
