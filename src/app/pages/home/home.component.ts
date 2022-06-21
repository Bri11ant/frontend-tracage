import { SyncDialogComponent } from './../../dialogs/sync-dialog/sync-dialog.component';
import { ProjectModel, KeyModel } from './../../models/models';
import { HomeService } from './home.service';
import { FileDialogComponent } from './../../dialogs/file-dialog/file-dialog.component';
import { NewKeyComponent } from './../../dialogs/new-key/new-key.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  projectData = new ProjectModel('', '{ }');
  references: string[] = [];

  constructor(private dialog: MatDialog, private homeService: HomeService) {}

  ngOnInit(): void {
    if (this.homeService.projectData) {
      this.projectData = this.homeService.projectData;
      this.references = this.homeService.references;
    }
  }

  onNewKey() {
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
        this.homeService.projectData.keys = this.projectData.keys;

        if (data.newKey.pin) {
          this.references.push(data.newKey.id);
          this.homeService.references = this.references;
        }
      }
      this.dialog.closeAll();
    });
  }

  onFile() {
    this.dialog.open(FileDialogComponent);
  }

  onToggleKeyVisibility(index: number) {
    this.projectData.keys[index].visible =
      !this.projectData.keys[index].visible;
    this.homeService.projectData.keys[index] = this.projectData.keys[index];
  }

  onToggleKeyPin(index: number) {
    this.projectData.keys[index].pin = !this.projectData.keys[index].pin;

    if (!this.projectData.keys[index].pin) {
      const _index = this.references.findIndex(
        (_ref) => _ref === this.projectData.keys[index].id
      );
      this.references.splice(_index, 1);
    } else {
      this.references.push(this.projectData.keys[index].id);
    }

    this.homeService.references = this.references;
    this.homeService.projectData.keys[index] = this.projectData.keys[index];
  }

  onRemoveKey(index: number) {
    if (this.projectData.keys[index].pin) {
      const _index = this.references.findIndex(
        (ref) => ref === this.projectData.keys[index].id
      );
      const _refToReset = this.references.splice(_index, 1);
      this.homeService.references = this.references;

      this.projectData.keys.forEach((k) => {
        if (k.ref === _refToReset[0]) {
          k.ref = '';
        }
      });
    }
    this.projectData.keys.splice(index, 1);
    this.homeService.projectData.keys = this.projectData.keys;
  }

  onSync(index: number) {
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
        this.homeService.references = this.references;
      }
      this.homeService.projectData.keys[index] = this.projectData.keys[index];
    });
  }

  onInputChange(key: KeyModel, value: string) {
    this.projectData.keys.forEach((k) => {
      if (k.ref === key.id) {
        k.value = value;
      }
      if (k.id === key.id) {
        k.value = value;
      }
    });
  }

  onSubmit() {
    const titleRef = this.getKeyInputRef('titre');
    if (titleRef && titleRef.value.length > 0) {
      this.projectData.json = this.homeService.printJSON();
      const outputRef = document.querySelector(
        '#JSON-output'
      ) as HTMLTextAreaElement;
      if (outputRef) {
        outputRef.value = this.projectData.json;
      }
    } else {
      alert('"title" key can\'t be empty!');
    }
    titleRef.focus();
  }

  onReorder(props: CdkDragDrop<string[]>) {
    const newIndex = props.currentIndex;
    const prevIndex = props.previousIndex;
    if (newIndex === prevIndex || newIndex * prevIndex === 0) {
      return;
    }
    moveItemInArray(this.projectData.keys, prevIndex, newIndex);
    this.homeService.projectData.keys = this.projectData.keys;
  }

  onSave() {
    //
  }

  onCancel() {
    //
  }

  getKeyInputRef(id: string) {
    const keyRef = document.querySelector(
      `.${id}-ref  input`
    ) as HTMLInputElement;
    // console.log('Ref:', keyRef);

    return keyRef;
  }
}
