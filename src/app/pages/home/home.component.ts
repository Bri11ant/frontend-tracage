import { RenameKeyComponent } from './../../dialogs/rename-key/rename-key.component';
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
  projectData = new ProjectModel('', '');
  references: string[] = [];

  outputManuallyEdited = false;

  constructor(private dialog: MatDialog, private homeService: HomeService) {}

  initProject() {
    if (this.homeService.projectData) {
      this.projectData = this.homeService.projectData;
      this.references = this.homeService.references;

      if (
        this.projectData.title !== '' &&
        this.projectData.title.toLocaleLowerCase() !== 'new project'
      ) {
        this.initShortcut();
      } else {
        const dialogRef = this.dialog.open(FileDialogComponent, {
          autoFocus: false,
          disableClose: true,
          panelClass: 'landing-dialog-box',
        });
        dialogRef.afterClosed().subscribe((props: { action: string }) => {
          if ((props.action === 'open-project', 'new-project')) {
            this.initProject();
          } else {
            console.log('props:', props);
          }
        });
      }
    }
    this.getKeyInputRef(0)?.focus();
  }

  ngOnInit(): void {
    this.initProject();
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

      setTimeout(() => {
        this.getKeyInputRef(this.projectData.keys.length - 1)?.focus();
      }, 100);
    });
  }

  onRename(index: number) {
    if (index === 0) {
      return;
    }
    const _dialogRef = this.dialog.open(RenameKeyComponent, {
      data: { index },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (!data) {
        return;
      }
      this.projectData.keys[index].label = data.newLabel;
      this.homeService.projectData.keys[index] = this.projectData.keys[index];
    });
  }

  onFile() {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((props: { action: string }) => {
      if (
        props &&
        (props.action === 'open-project' || props.action === 'new-project')
      ) {
        this.initProject();
      } else if (props && props.action === 'generate-JSON') {
        const data = this.homeService.projectData.json;
        console.warn(data);
      } else {
        console.log('props:', props);
      }
    });
  }

  onToggleKeyVisibility(index: number) {
    if (index === 0) {
      return;
    }
    this.projectData.keys[index].visible =
      !this.projectData.keys[index].visible;
    this.homeService.projectData.keys[index] = this.projectData.keys[index];

    const ref = this.getKeyInputRef(index);
    if (ref && ref.disabled) {
      setTimeout(() => {
        ref.focus();
      }, 100);
    }
  }

  onToggleKeyPin(index: number) {
    if (index === 0) {
      return;
    }
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

    const ref = this.getKeyInputRef(index);
    if (ref) {
      setTimeout(() => {
        ref.focus();
      }, 100);
    }
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

  onInputKeyup($ev: KeyboardEvent, index: number) {
    if ($ev.code === 'Enter') {
      if (
        index === this.projectData.keys.length - 1 ||
        $ev.shiftKey ||
        $ev.ctrlKey
      ) {
        this.onSubmit();
        return;
      }
      this.nextInputRef(index);
    } else if ($ev.code === 'Space') {
      if (($ev.shiftKey || $ev.ctrlKey) && index !== 0) {
        this.onToggleKeyVisibility(index);
        this.nextInputRef(index);
      }
    } else if ($ev.altKey) {
      if ($ev.code.toLowerCase() === 'keyp') {
        this.onToggleKeyPin(index);
      } else if ($ev.code.toLowerCase() === 'keyr') {
        // const menuRef = document.querySelector(
        //   '#menu-trigger'
        // ) as HTMLButtonElement;
        // menuRef?.click();
        this.onRename(index);
      }
    }
  }

  onSubmit() {
    const titleRef = this.getKeyInputRef(0);
    if (titleRef && titleRef.value.trim().length > 0) {
      this.refreshOutput();
      this.projectData.json = this.homeService.printJSON();
      this.refreshOutput();
    } else {
      alert('"title" key can\'t be empty!');
    }
    const outputRef = document.querySelector(
      '#JSON-output'
    ) as HTMLTextAreaElement;
    outputRef?.scrollTo({
      top: outputRef.scrollHeight,
    });
    setTimeout(() => {
      titleRef?.focus();
    }, 100);
  }

  onReorder(props: CdkDragDrop<string[]>) {
    const newIndex = props.currentIndex;
    const prevIndex = props.previousIndex;

    setTimeout(() => {
      this.getKeyInputRef(newIndex)?.focus();
    }, 100);

    if (newIndex === prevIndex || newIndex * prevIndex === 0) {
      return;
    }
    moveItemInArray(this.projectData.keys, prevIndex, newIndex);
    this.homeService.projectData.keys = this.projectData.keys;
  }

  onSave() {
    const outputRef = document.querySelector(
      '#JSON-output'
    ) as HTMLTextAreaElement;
    if (outputRef) {
      this.projectData.json = outputRef.value.trim();
      this.homeService.projectData.json = outputRef.value.trim();
    }
    this.outputManuallyEdited = false;
    this.getKeyInputRef(0)?.focus();
  }

  onCancel() {
    this.refreshOutput();
    this.outputManuallyEdited = false;
    this.getKeyInputRef(0)?.focus();
  }

  getKeyInputRef(index: number) {
    if (!this.projectData.keys[index]) {
      return undefined;
    }
    const id = this.projectData.keys[index].id;
    const keyRef = document.querySelector(
      `.${id}-ref  input`
    ) as HTMLInputElement;

    return keyRef;
  }

  refreshOutput() {
    const outputRef = document.querySelector(
      '#JSON-output'
    ) as HTMLTextAreaElement;
    if (outputRef) {
      outputRef.value = this.projectData.json;
    }
  }

  nextInputRef(index: number) {
    if (index === this.projectData.keys.length - 1) {
      (document.querySelector('#submitToJSON') as HTMLButtonElement)?.focus();
      return;
    }
    const keyRef = this.getKeyInputRef(index + 1);

    if (keyRef) {
      if (keyRef.disabled) {
        this.nextInputRef(index + 1);
        return;
      }
      keyRef.focus();
    }
  }

  initShortcut() {
    document.addEventListener('keyup', ($ev) => {
      if ($ev.altKey) {
        switch ($ev.code.toLowerCase()) {
          case 'keyo':
            this.onFile();
            break;

          case 'keyn':
            this.onNewKey();
            break;

          case 'keys':
            this.onSave();
            break;

          default:
            break;
        }
      }
      /* PREVIEW */
      // console.log('code:', $ev.code);
    });
  }
}
