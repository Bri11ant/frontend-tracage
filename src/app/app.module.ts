import { MaterialModule } from './modules/material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, SandboxComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}