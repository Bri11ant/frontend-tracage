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
    const keys = this.projectData.keys.filter((k) => k.visible);
    let result = `{
    "${keys[0].value.trim().replace(',', '.')} :" {
        `;
    keys.forEach((k, index) => {
      if (index !== 0) {
        result += `"${k.label.trim()}": "${k.value.trim().replace(',', '.')}"${
          index === keys.length - 1
            ? `
    }`
            : ','
        }
        `;
      }
      if (keys.length === 1) {
        result += `
    }`;
      }
    });
    result += `
}`;
    keys.forEach((k) => {
      // result += k.
    });

    this.projectData.json = result;

    return result;
  }
}
