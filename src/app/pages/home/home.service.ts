import { ProjectModel } from './../../models/models';
import { DATA_SAMPLE_PROJECT } from './../../data/project.data';
import { Injectable } from '@angular/core';
import { replaceAll } from 'src/app/utility/methods';

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
    let result = this.projectData.json;
    const keys = this.projectData.keys.filter((k) => k.visible);

    if (
      !result ||
      result.trim() === '{ }' ||
      result.trim() === '{}' ||
      result.trim() === ''
    ) {
      result = `{
    "${replaceAll(
      replaceAll(replaceAll(keys[0].value.trim(), '\\', '\\\\'), '"', `\\"`),
      ',',
      '.'
    )}" : {
        `;
    } else {
      result = this.cropResult(
        result,
        replaceAll(
          replaceAll(
            replaceAll(keys[0].value.trim(), '\\', '\\\\'),
            '"',
            `\\"`
          ),
          ',',
          '.'
        )
      );
    }

    keys.forEach((k, index) => {
      if (index !== 0) {
        result += `"${k.label.trim()}": "${k.value
          .trim()
          .replace(',', '.')
          .replace('"', `\\"`)}"${
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

    this.projectData.json = result;

    return result;
  }

  cropResult(result: string, header: string) {
    let lastBraceIndex = 0;
    let pingBrace = 0;
    for (let i = 1; i < result.length; i++) {
      if (result.charAt(result.length - i) === '}') {
        pingBrace++;
        if (pingBrace === 2) {
          lastBraceIndex = result.length - i;
        }
      }
    }
    return (
      result.slice(0, lastBraceIndex + 1) +
      `,
    "${header} :" {
        `
    );
  }
}
