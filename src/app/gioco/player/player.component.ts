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
  shipsToPlace = [4, 3, 2, 2];
  constructor(myId: number) {
    this.id = myId;
  }

  ngOnInit() {
  }

}
