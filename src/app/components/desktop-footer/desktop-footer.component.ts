import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from '../about/about.component';
import { KnownIssuesComponent } from '../known-issues/known-issues.component';
import { faInfoCircle, faExclamationTriangle, faBullhorn, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-desktop-footer',
  templateUrl: './desktop-footer.component.html',
  styleUrls: ['./desktop-footer.component.scss'],
  providers: [MatDialog]
})
export class DesktopFooterComponent implements OnInit {

  public readonly info = faInfoCircle;

  public readonly warning = faExclamationTriangle;

  public readonly report = faBullhorn;

  public readonly linkedIn = faLinkedin;

  public readonly pencil = faPencilAlt;

  constructor(
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public launchAbout() {

    const dialogRef = this.dialog.open(AboutComponent);

  }

  public launchKnownIssues() {

    const dialogRef = this.dialog.open(KnownIssuesComponent);

  }

}
