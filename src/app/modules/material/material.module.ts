import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import {} from '@angular/material/';
import {} from '@angular/material/';
import {} from '@angular/material/';

const materials = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatMenuModule,
  MatDialogModule,
];

@NgModule({
  imports: [materials],
  exports: [materials],
})
export class MaterialModule {}
