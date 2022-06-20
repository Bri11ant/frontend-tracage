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
  dataSampleJSON = DATA_SAMPLE_LOTS;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.onNewKey();
  }

  onNewKey() {
    this.dialog.open(NewKeyComponent);
  }
}
