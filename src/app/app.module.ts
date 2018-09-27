import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GiocoComponent } from './gioco/gioco.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatFormField } from '../../node_modules/@angular/material/form-field';
import {MatInputModule, MatButtonModule} from '@angular/material';
import { PlayerComponent } from './gioco/player/player.component';
import { BoardComponent } from './gioco/board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    GiocoComponent,
    PlayerComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [GiocoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
