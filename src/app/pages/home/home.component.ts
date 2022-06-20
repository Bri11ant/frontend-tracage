import { ProjectModel } from './../../models/models';
import { HomeService } from './home.service';
import { FileDialogComponent } from './../../dialogs/file-dialog/file-dialog.component';
import { NewKeyComponent } from './../../dialogs/new-key/new-key.component';
import { DATA_SAMPLE_LOTS } from './../sandbox/data/lots.json';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  projectData = new ProjectModel('', '{ }', []);

  constructor(private dialog: MatDialog, private homeService: HomeService) {}

  ngOnInit(): void {
    if (this.homeService.projectData) {
      this.projectData = this.homeService.projectData;
    }
  }

  onNewKey() {
    this.dialog.open(NewKeyComponent);
  }

  onFile() {
    this.dialog.open(FileDialogComponent);
  }
}
