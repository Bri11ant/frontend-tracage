import { RenameKeyComponent } from './../../dialogs/rename-key/rename-key.component';
import { NewKeyComponent } from './../../dialogs/new-key/new-key.component';
import { SyncDialogComponent } from './../../dialogs/sync-dialog/sync-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModel, KeyModel } from './../../models/models';
// import { DATA_SAMPLE_PROJECT } from './../../data/project.data';
import { Injectable } from '@angular/core';
import { escapeRegExp } from 'src/app/utility/methods';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // projectData = DATA_SAMPLE_PROJECT;
  private projectData: ProjectModel;
  projectSubject = new Subject<ProjectModel>();
  private references: string[] = [];
  referenceSubject = new Subject<string[]>();

  constructor(private dialog: MatDialog) {
    this.projectData = new ProjectModel('', '');
    this.refreshReferences();
  }

  emitProjectSubject() {
    this.projectSubject.next(this.projectData);
  }

  emitReferences() {
    this.referenceSubject.next(this.references.slice());
  }

  refreshReferences() {
    this.references = this.projectData.keys
      .filter((k) => k.pin)
      .map((k) => k.id);
    this.emitReferences();
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
    "${escapeRegExp(keys[0].value, 'JSON')}" : {
        `;
    } else {
      result = this.cropResult(result, escapeRegExp(keys[0].value, 'JSON'));
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
    this.emitProjectSubject();
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

  /* SUBSCRIBE */
  addNewKey() {
    const newKeyRef = this.dialog.open(NewKeyComponent);
    newKeyRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data.newKey.ref.length > 0) {
          const newKeyValue = this.projectData.keys.find(
            (k) => k.id === data.newKey.ref
          )?.value;
          if (newKeyValue) {
            data.newKey.value = newKeyValue.trim();
          }
        }
        this.projectData.keys.push(data.newKey);
        this.emitProjectSubject();

        if (data.newKey.pin) {
          this.addNewReference(data.newKey.id);
        }
      }
      this.dialog.closeAll();
    });
  }

  addNewReference(newRef: string) {
    this.references.push(newRef);
    this.emitReferences();
  }

  renameKey(index: number) {
    const _dialogRef = this.dialog.open(RenameKeyComponent, {
      data: { index },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (!data) {
        return;
      }
      this.projectData.keys[index].label = data.newLabel;
      this.emitProjectSubject();
    });
  }

  toggleKeyVisibility(index: number) {
    this.projectData.keys[index].visible =
      !this.projectData.keys[index].visible;
    this.emitProjectSubject();
  }

  setAllKeysVisible() {
    this.projectData.keys.forEach((k) => (k.visible = true));
    this.emitProjectSubject();
  }

  toggleKeyPin(index: number) {
    this.projectData.keys[index].pin = !this.projectData.keys[index].pin;
    this.emitProjectSubject();

    if (!this.projectData.keys[index].pin) {
      const _index = this.references.findIndex(
        (_ref) => _ref === this.projectData.keys[index].id
      );
      this.references.splice(_index, 1);
    } else {
      this.references.push(this.projectData.keys[index].id);
    }
    this.emitReferences();
  }

  removeKey(index: number) {
    if (this.projectData.keys[index].pin) {
      const _index = this.references.findIndex(
        (ref) => ref === this.projectData.keys[index].id
      );
      const _refToReset = this.references.splice(_index, 1);
      this.emitReferences();

      this.projectData.keys.forEach((k) => {
        if (k.ref === _refToReset[0]) {
          k.ref = '';
        }
      });
    }
    this.projectData.keys.splice(index, 1);
    this.emitProjectSubject();
  }

  syncKey(index: number) {
    const _dialogRef = this.dialog.open(SyncDialogComponent, {
      data: { index, from: 'home' },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (!data) {
        return;
      }
      this.projectData.keys[index].ref = data.ref;

      if (data.ref) {
        this.projectData.keys[index].pin = false;
        const _index = this.references.findIndex(
          (_ref) => _ref === this.projectData.keys[index].id
        );
        this.references.splice(_index, 1);
        this.emitReferences();
      }
      this.emitProjectSubject();
    });
  }

  sortKeys(keys: KeyModel[]) {
    this.projectData.keys = keys;
    this.emitProjectSubject();
  }

  manuallyEditJSON(newValue: string) {
    this.projectData.json = newValue.trim();
    this.emitProjectSubject();
  }

  createProject(newProject: ProjectModel) {
    this.projectData = newProject;
    this.emitProjectSubject();
    this.references = [];
    this.emitReferences();
  }

  getKeys() {
    return this.projectData.keys;
  }

  getReferences() {
    return this.references;
  }
}
