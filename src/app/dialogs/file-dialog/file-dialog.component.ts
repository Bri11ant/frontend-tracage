import { HomeService } from './../../pages/home/home.service';
import { replaceAll } from 'src/app/utility/methods';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { readFileAsText } from 'src/app/utility/utils';
import { ProjectModel } from 'src/app/models/models';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.scss'],
})
export class FileDialogComponent implements OnInit, AfterViewInit {
  hideGenJSON = false;
  newProjectField = false;

  constructor(
    private dialog: MatDialogRef<FileDialogComponent>,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    if (this.dialog.disableClose) {
      this.hideGenJSON = true;
    }
  }

  ngAfterViewInit(): void {
    const backdropRef = document.querySelector(
      '.cdk-overlay-dark-backdrop'
    ) as HTMLDivElement | null;
    if (backdropRef && this.dialog.disableClose) {
      backdropRef.style.background = 'rgba(0,0,0,0.6)';
    }
  }

  onInputChange(inputRef: HTMLInputElement, $ev: KeyboardEvent) {
    if ($ev.code.toLocaleLowerCase() === 'enter') {
      this.onSubmit(inputRef.value);
    }
  }

  onOpenProject($ev: any) {
    const file = $ev.path[0].files[0] as File | undefined;

    if (!file) {
      return;
    }
    const fileData$ = readFileAsText(file);
    fileData$.subscribe((data) => {
      const title = file.name.split('.json')[0].trim();
      this.homeService.projectData = new ProjectModel(title, data);
      this.dialog.close({ action: 'open-project' });
    });
  }

  onSubmit(title: string) {
    if (title.trim().length > 1) {
      this.homeService.projectData = new ProjectModel(title, '{ }');
      this.dialog.close({ action: 'new-project' });
    }
  }

  onGenerateJSON() {
    this.dialog.close({ action: 'generate-JSON' });
  }

  onToggleInput() {
    this.newProjectField = !this.newProjectField;
    setTimeout(() => {
      if (this.newProjectField) {
        const _ref = document.querySelector(
          '.new-project-field'
        ) as HTMLDivElement | null;
        if (_ref) {
          _ref.querySelector('input')?.focus();
          _ref.style.height = 'inherit';
          _ref.style.opacity = '1';
        }
      }
    }, 100);
  }
}
