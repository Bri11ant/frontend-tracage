import { MaterialModule } from './modules/material/material.module';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NewKeyComponent } from './dialogs/new-key/new-key.component';
import { FileDialogComponent } from './dialogs/file-dialog/file-dialog.component';
import { SyncDialogComponent } from './dialogs/sync-dialog/sync-dialog.component';
import { RenameKeyComponent } from './dialogs/rename-key/rename-key.component';

@NgModule({
  declarations: [AppComponent, SandboxComponent, HomeComponent, NewKeyComponent, FileDialogComponent, SyncDialogComponent, RenameKeyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
