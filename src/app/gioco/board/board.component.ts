import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

    // targetOrSelf: number;   // target = 0, self = 1
    // type: number;   // 0 = propria, 1 = altrui
    player: PlayerComponent;
    tiles: Object[];

    constructor() { }

    // chose() {
    //     for (let i = 0; i < 6; i++) {
    //         this.getPosition(event);
    //         alert('Piazzate ' + (i + 1) + 'navi');
    //     }
    // }

    // getPosition(e: any) {
    //     const id = e.target.id;
    //     const boardId = id.substring(1, 2);
    //     const row = id.substring(2, 3);
    //     const col = id.substring(3, 4);
    //     // const tile = this.boards[boardId].tiles[row][col];
    //     const tile = {
    //         boardId: boardId,
    //         row: row,
    //         col: col
    //     };
    //     return tile;
    // }


    ngOnInit() {
    }

}
