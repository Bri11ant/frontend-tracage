import { DATA_SAMPLE_LOTS } from './../sandbox/data/lots.json';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dataSampleJSON = DATA_SAMPLE_LOTS;

  constructor() {}

  ngOnInit(): void {}
}
