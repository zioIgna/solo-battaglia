import { Ship } from './../ship.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  id: number;
  score = 0;
  // shipsToPlace = 3;
  // shipsToPlace = [4, 3, 2, 2];
  shipsToPlace = [];  // domanda: che differenza c'è tra questa forma di creare un array e shipsToPlace: Ship[] ?
  opponentShips = [];

  Cacciatorpediniere01: Ship = {
    id: 'cacciatorpediniere01',
    size: 2,
    hits: 2
  };
  Cacciatorpediniere02: Ship = {
    id: 'cacciatorpediniere02',
    size: 2,
    hits: 2
  };
  Cacciatorpediniere03: Ship = {
    id: 'cacciatorpediniere03',
    size: 2,
    hits: 2
  };
  Cacciatorpediniere04: Ship = {
    id: 'cacciatorpediniere04',
    size: 2,
    hits: 2
  };
  Sottomarino01: Ship = {
    id: 'sottomarino01',
    size: 3,
    hits: 3
  };
  Sottomarino02: Ship = {
    id: 'sottomarino02',
    size: 3,
    hits: 3
  };
  Corazzata01: Ship = {
    id: 'corazzata01',
    size: 4,
    hits: 4
  };
  Corazzata02: Ship = {
    id: 'corazzata02',
    size: 4,
    hits: 4
  };
  Portaerei: Ship = {
    id: 'portaerei',
    size: 5,
    hits: 5
  };

  constructor(myId: number) {
    this.id = myId;

    this.shipsToPlace.push(
      this.Cacciatorpediniere01, this.Cacciatorpediniere02, this.Cacciatorpediniere03, this.Cacciatorpediniere04,
      this.Sottomarino01, this.Sottomarino02, this.Corazzata01, this.Corazzata02, this.Portaerei
    );
  }

  ngOnInit() {

  }

}
