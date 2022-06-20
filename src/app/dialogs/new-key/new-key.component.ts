import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-key',
  templateUrl: './new-key.component.html',
  styleUrls: ['./new-key.component.scss'],
})
export class NewKeyComponent implements OnInit {
  constructor(private dialog: MatDialogRef<NewKeyComponent>) {}

  ngOnInit(): void {
    window.addEventListener('keydown', ($ev) => {
      if ($ev.code === 'Enter') {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    this.dialog.close();
  }
}
