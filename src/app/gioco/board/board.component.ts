import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

    // targetOrSelf: number;   // target = 0, self = 1
    player: PlayerComponent;
    tiles: Object[];

    constructor() { }

    ngOnInit() {
    }

}
