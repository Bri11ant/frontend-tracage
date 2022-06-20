import { DATA_SAMPLE_PROJECT } from './../../data/project.data';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  projectData = DATA_SAMPLE_PROJECT;

  constructor() {}
}
