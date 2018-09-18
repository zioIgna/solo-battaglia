import { Component, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '../../../node_modules/@angular/material';
import { BoardComponent } from './board/board.component';
import { PlayerComponent } from './player/player.component';

@Component({
    selector: 'app-gioco',
    templateUrl: './gioco.component.html',
    styleUrls: ['./gioco.component.css']
})
export class GiocoComponent implements OnInit {

    // grid: any[] = [];
    // gridValues: any[] = [];
    boards: BoardComponent[] = [];
    boardSize = 5;
    // numRow = 4;
    // numCol = 4;
    currPlayer = 0;
    playersNumber = 2;
    hits = 0;

    constructor() { }

    initializeGame() {
        this.createBoards();
        this.placeShips();
    }

    createBoards() {
        for (let i = 0; i < this.playersNumber; i++) {
            const player = new PlayerComponent(i);
            // player.id = i;
            const board = new BoardComponent();
            board.player = player;
            // board.targetOrSelf = 0;
            board.tiles = this.setTiles();
            // const boardSelf = new BoardComponent();
            // boardSelf.player = player;
            // boardSelf.targetOrSelf = 1;
            // boardSelf.tiles = this.setTiles();
            this.boards.push(board);
            // this.boards.push(boardSelf);
        }
    }

    setTiles() {
        const tiles = [];
        for (let i = 0; i < this.boardSize; i++) {
            tiles[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                tiles[i][j] = { used: false, value: '0', status: '' };
            }
        }
        return tiles;
    }

    placeShips() {
        for (let i = 0; i < this.playersNumber; i++) {
            // this.boards[this.currPlayer].chose();
            this.currPlayer = (this.currPlayer++) % this.playersNumber;
        }
    }

    // chose() {
    //     for (let i = 0; i < 6; i++) {
    //         this.getPosition(event);
    //         alert('Piazzate ' + (i + 1) + 'navi');
    //     }
    // }

    getPosition(e: any) {
        const id = e.target.id;
        const boardId = id.substring(1, 2);
        const row = id.substring(2, 3);
        const col = id.substring(3, 4);
        const tile = this.boards[boardId].tiles[row][col];
        alert('La casella è: ' + JSON.stringify(id));
        this.boards[boardId].tiles[row][col].value = 'X';
    }


    // 0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot

    // initialize2() {
    //     for (let i = 0; i < this.numRow; i++) {
    //         this.grid[i] = [];
    //         this.gridValues[i] = [];
    //         for (let j = 0; j < this.numCol; j++) {
    //             this.grid[i][j] = 0;
    //             this.gridValues[i][j] = 0;
    //         }
    //     }
    // }

    // selectPlayer(max) {
    //     return Math.floor(Math.random() * Math.floor(max));
    // }

    // placeShip() {
    //     this.grid[0][0] = 1;
    //     this.grid[0][1] = 1;
    // }

    // refreshGrid() {
    //     for (let i = 0; i < this.numRow; i++) {
    //         for (let j = 0; j < this.numCol; j++) {
    //             this.grid[i][j] = this.gridValues[i][j];
    //         }
    //     }
    // }

    // onFire(row, col) {
    //     const r = row.value;
    //     const c = col.value;
    //     console.log(r, c);
    //     if (this.grid[r][c] === 1) {
    //         this.gridValues[r][c] = 2;
    //         this.hits++;
    //         console.log('la griglia alla casella ' + r + ', ' + c + ' ha valore: ' + this.grid[r][c]);
    //         console.log('number of hits: ', this.hits);
    //         this.refreshGrid();
    //         this.checkScore();
    //     } else {
    //         this.gridValues[r][c] = 3;
    //         this.refreshGrid();
    //     }
    // }

    // checkScore() {
    //     if (this.hits === 2) {
    //         console.log('hai vinto!');
    //     }
    // }

    ngOnInit() {
        this.initializeGame();
        // this.initialize2();
        // this.placeShip();
    }

}
