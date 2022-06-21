import { ProjectModel } from './../../models/models';
import { DATA_SAMPLE_PROJECT } from './../../data/project.data';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // projectData = DATA_SAMPLE_PROJECT;
  projectData: ProjectModel;
  references: string[] = [];

  constructor() {
    this.projectData = new ProjectModel('', '{ }');
    this.refreshReferences();
  }

  refreshReferences() {
    this.references = this.projectData.keys
      .filter((k) => k.pin)
      .map((k) => k.id);

    return this.references;
  }

  printJSON() {
    let result = `{
    "${this.projectData.keys[0].value.trim()} :" {
        `;
    this.projectData.keys.forEach((k, index) => {
      if (index !== 0) {
        result += `"${k.label.trim()}": "${k.value.trim()}"${
          index === this.projectData.keys.length - 1 ? '' : ','
        }
        `;
      }
    });
    result += `
    }
}`;
    this.projectData.keys.forEach((k) => {
      // result += k.
    });

    this.projectData.json = result;
    return result;
  }
}
