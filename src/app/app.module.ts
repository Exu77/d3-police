import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MurderComponent } from './components/murder/murder.component';
import { MurderStructComponent } from './components/murder-struct/murder-struct.component';
import { MurderFilterComponent } from './components/murder-filter/murder-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    MurderComponent,
    MurderStructComponent,
    MurderFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
