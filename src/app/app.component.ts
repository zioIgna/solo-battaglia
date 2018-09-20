import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  ngOnInit(): void {
    this.connessione.getConnection();
    console.log(this.connessione.socket);
  }

  constructor(private connessione: ConnectionService) {}
}
