import { GiocoComponent } from './gioco/gioco.component';
import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private connessione: ConnectionService, private gioco: GiocoComponent) { }

  ngOnInit(): void {
    this.connessione.getConnection();
    console.log(this.connessione.socket);

    this.connessione.socket.on('new connection', (numPlayers) => {
      this.gioco.loggedPlayers = numPlayers.loggedPlayers;
      console.log('the players number is: ' + this.gioco.loggedPlayers);
      if (numPlayers.loggedPlayers === 2) {
        console.log('finally 2 logged players!');
        // this.gioco.initializeGame();
        this.gioco.createBoards();
      }
    });

  }



}
