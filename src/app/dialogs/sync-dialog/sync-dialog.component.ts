import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeService } from './../../pages/home/home.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-sync-dialog',
  templateUrl: './sync-dialog.component.html',
  styleUrls: ['./sync-dialog.component.scss'],
})
export class SyncDialogComponent implements OnInit {
  references: { label: string; id: string }[] = [];
  keys: { label: string; id: string }[] = [];
  currentRef = '';

  constructor(
    private homeService: HomeService,
    private dialogRef: MatDialogRef<SyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private props: { index: number; from: string }
  ) {}

  ngOnInit(): void {
    this.keys = this.homeService.projectData.keys.map((k) => ({
      label: k.label,
      id: k.id,
    }));

    if (this.props.from === 'home') {
      this.keys = this.keys.filter(
        (k) => k.id !== this.homeService.projectData.keys[this.props.index].id
      );
    }

    this.homeService.references.forEach((ref) => {
      const key = this.keys.find((k) => k.id === ref);
      if (key) {
        this.references.push(key);
      }
    });

    if (this.props.index > -1) {
      if (this.props.from === 'home') {
        this.currentRef =
          this.homeService.projectData.keys[this.props.index].ref;
      } else {
        this.currentRef = this.keys[this.props.index].id;
      }
    }
  }

  onSelect(ref: string) {
    setTimeout(() => {
      this.dialogRef.close({ ref });
    }, 500);
  }
}
