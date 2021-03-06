import { HomeService } from './../../pages/home/home.service';
import { SyncDialogComponent } from './../sync-dialog/sync-dialog.component';
import { KeyModel } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { generateID } from 'src/app/utility/methods';

@Component({
  selector: 'app-new-key',
  templateUrl: './new-key.component.html',
  styleUrls: ['./new-key.component.scss'],
})
export class NewKeyComponent implements OnInit {
  label = '';
  pin = false;
  ref = '';
  keys: KeyModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<NewKeyComponent>,
    private dialog: MatDialog,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.keys = this.homeService.getKeys();

    window.addEventListener('keydown', ($ev) => {
      if ($ev.code === 'Enter') {
        if (this.label.length > 0) {
          this.onSubmit();
        }
      }
    });
  }

  onSubmit() {
    if (this.label.length < 1) {
      // alert("Input can't be empty!");
      return;
    }

    if (
      this.keys.findIndex(
        (k) => k.label.toLowerCase() === this.label.toLowerCase().trim()
      ) > -1
    ) {
      // alert('Key exists already!');
      return;
    }

    let newKeyID = generateID(this.label);
    if (this.keys.findIndex((k) => k.id === newKeyID) > -1) {
      newKeyID += new Date().getTime();
    }

    const newKey = new KeyModel(this.label.trim(), this.pin);
    newKey.ref = this.ref;

    this.dialogRef.close({ newKey });
  }

  onInputChange(elementRef: HTMLInputElement) {
    this.label = elementRef.value;
    const found =
      this.keys.findIndex(
        (k) => k.label.toLowerCase() === this.label.toLowerCase().trim()
      ) > -1;
    if (found) {
      elementRef.style.outline = '2px solid #b22222';
    } else {
      elementRef.style.outline = '2px solid #b2222200';
    }
  }

  onSync() {
    const index = this.homeService
      .getReferences()
      .findIndex((ref) => ref === this.ref);

    const _dialogRef = this.dialog.open(SyncDialogComponent, {
      data: { index, from: 'new-key' },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.ref = data.ref;

        if (data.ref && data.ref.length > 0) {
          this.pin = false;
        }
      }
    });
  }
}
