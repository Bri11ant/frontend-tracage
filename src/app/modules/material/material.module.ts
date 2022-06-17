import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {} from '@angular/material/';
import {} from '@angular/material/';
import {} from '@angular/material/';
import {} from '@angular/material/';

const materials = [MatButtonModule, MatCardModule, MatIconModule];

@NgModule({
  imports: [materials],
  exports: [materials],
})
export class MaterialModule {}
