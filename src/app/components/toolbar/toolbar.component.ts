import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { faVirus } from '@fortawesome/free-solid-svg-icons';
import { FilterService } from 'src/app/services/filter.service';
import { Region } from 'src/app/models/data-model';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input()
  public sidenavRef: TemplateRef<MatSidenav>;

  public covidIcon = faVirus;

  public get region(): Region {
    return this.filterService.region;
  }

  public enumToRegionMap = {};

  constructor(
    private readonly filterService: FilterService
  ) { }

  ngOnInit() {
    this.enumToRegionMap[Region.Global] = 'Worldwide';
    this.enumToRegionMap[Region.Country] = 'Country';
    this.enumToRegionMap[Region.State] = 'Province/State';
    this.enumToRegionMap[Region.County] = 'County';
  }

  public updateRegion(region: Region) {
    this.filterService.updateRegion.next(region);
  }

}
