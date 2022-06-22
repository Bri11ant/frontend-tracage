import { HomeService } from './../../pages/home/home.service';
import { KeyModel } from './../../models/models';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-key',
  templateUrl: './rename-key.component.html',
  styleUrls: ['./rename-key.component.scss'],
})
export class RenameKeyComponent implements OnInit {
  label = '';
  keys: KeyModel[] = [];
  key!: KeyModel;

  constructor(
    private dialogRef: MatDialogRef<RenameKeyComponent>,
    private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) private props: { index: number }
  ) {}

  ngOnInit(): void {
    this.keys = this.homeService.getKeys();
    this.key = this.keys[this.props.index];

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
      return;
    }

    if (this.label.trim().toLowerCase() === this.key.label.toLowerCase()) {
      this.dialogRef.close();
      return;
    }

    if (
      this.keys.findIndex(
        (k) => k.label.toLowerCase() === this.label.toLowerCase()
      ) > -1
    ) {
      return;
    }
    this.dialogRef.close({ newLabel: this.label.toLowerCase() });
  }

  onInputChange(elementRef: HTMLInputElement) {
    this.label = elementRef.value;
    const found =
      this.keys.findIndex(
        (k) =>
          k.label.toLowerCase() === this.label.toLowerCase().trim() &&
          this.label.toLowerCase().trim() !== this.key.label.toLowerCase()
      ) > -1;
    if (found) {
      elementRef.style.outline = '2px solid #b22222';
    } else {
      elementRef.style.outline = '2px solid #b2222200';
    }
  }
}
