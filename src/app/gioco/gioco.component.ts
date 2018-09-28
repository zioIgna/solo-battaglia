import { ConnectionService } from './../connection.service';
import { Component, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '../../../node_modules/@angular/material';
import { BoardComponent } from './board/board.component';
import { PlayerComponent } from './player/player.component';

@Component({
    selector: 'app-gioco',
    templateUrl: './gioco.component.html',
    styleUrls: ['./gioco.component.css'],
    // providers: [GiocoComponent]
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
    loggedPlayers = 0;
    endGame = false;
    // winner: number;

    constructor(private connessione: ConnectionService) { }

    initializeGame() {
        if (this.loggedPlayers === 2) {
            this.createBoards();
        }
        // this.placeShips();
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

    // placeShips() {
    //     for (let i = 0; i < this.playersNumber; i++) {
    //         this.chose(i);
    //         this.currPlayer = (this.currPlayer++) % this.playersNumber;
    //     }
    // }

    chose(playerId: number) {
        for (let i = 0; i < 6; i++) {
            this.getPosition(event);
            alert('Piazzate ' + (i + 1) + 'navi');
        }
    }

    getPosition(e: any) {
        const id = e.target.id;
        const boardId = id.substring(1, 2);
        const row = id.substring(2, 3);
        const col = id.substring(3, 4);
        const tile = this.boards[boardId].tiles[row][col];
        const ship = { boardId: boardId, row: row, col: col };
        alert('La casella è: ' + JSON.stringify(id) + ' used: ' + JSON.stringify(tile.used));
        if (this.boards[this.currPlayer].player.shipsToPlace || this.boards[(this.currPlayer + 1) % this.playersNumber]
            .player.shipsToPlace) {     // ci sono ancora navi da posizionare (per almeno uno dei giocatori)
            // verifico corrispondenza tra chi fa la mossa e il turno del giocatore:
            if (this.currPlayer === this.connessione.connectionId) {
                if (+boardId === this.currPlayer && this.boards[this.currPlayer].player.shipsToPlace) { // si posizionano le navi
                    // this.boards[this.currPlayer].tiles[row][col].value = 'U';
                    this.boards[this.currPlayer].tiles[row][col].used = true;
                    this.connessione.socket.emit('new ship', ship);
                    this.boards[this.currPlayer].player.shipsToPlace--;
                    console.log('l\' attuale giocatore è: ' + this.currPlayer + ' ' + this.boards[this.currPlayer].player.shipsToPlace);
                    if (!this.boards[this.currPlayer].player.shipsToPlace) {
                        // this.currPlayer++;
                        this.connessione.socket.emit('switch player');
                        this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
                        console.log('l\' attuale giocatore è: ' + this.currPlayer + ' ' + this.boards[this.currPlayer].player.shipsToPlace);
                    }
                }
            } else {
                console.log('It\'s not your turn to play');     // il giocatore che ha selezionato la casella non ha rispettato il turno
            }
        } else {    // si comincia a sparare
            if (this.currPlayer === this.connessione.connectionId) {
                if (+boardId !== this.currPlayer) {     // sto sparando nella griglia dell'avversario
                    // if (this.boards[boardId].tiles[row][col].value === 'U') {
                    if (this.boards[boardId].tiles[row][col].used === true) {
                        this.boards[boardId].tiles[row][col].value = 'X';
                        this.connessione.socket.emit('hit', ship);
                        this.boards[this.currPlayer].player.score++;
                        if (this.boards[this.currPlayer].player.score === 3) {
                            console.log('Giocatore ' + this.currPlayer + ', hai vinto!');
                            this.endGame = true;
                            // this.winner = this.currPlayer;
                            this.connessione.socket.emit('endGame');    // , this.currPlayer
                            return;
                        }
                        this.connessione.socket.emit('switch player');
                        this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
                        console.log('l\' attuale giocatore è: ' + this.currPlayer);
                        // } else if (this.boards[boardId].tiles[row][col].value === '0') {
                    } else if (this.boards[boardId].tiles[row][col].used === false) {
                        this.boards[boardId].tiles[row][col].value = 'M';
                        this.connessione.socket.emit('miss', ship);
                        this.connessione.socket.emit('switch player');
                        this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
                        console.log('l\' attuale giocatore è: ' + this.currPlayer);
                    } else {
                        console.log('Hai già sparato su questa casella, spara di nuovo!');
                    }
                } else {        // sto sparando nella mia griglia: errore
                    console.log('Devi sparare nell\'altra griglia!');
                }
            } else {
                console.log('It\'s not your turn to play');     // il giocatore che ha selezionato la casella non ha rispettato il turno
            }

        }
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
        // this.connessione.getConnection();
        // this.initializeGame();
        // this.initialize2();
        // this.placeShip();

        this.connessione.socket.on('new connection', (numPlayers) => {
            this.loggedPlayers = numPlayers.loggedPlayers;
            console.log('the players number is: ' + this.loggedPlayers);

            if (this.connessione.connectionId === -1) {
                this.connessione.connectionId = this.loggedPlayers - 1;
                console.log('my connectionId is: ' + this.connessione.connectionId);
            }

            if (numPlayers.loggedPlayers === 2 && this.boards.length < 2) {
                console.log('finally 2 logged players!');
                // this.gioco.initializeGame();
                this.createBoards();
            }
        });


        this.connessione.socket.on('new ship', (ship) => {
            // this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'U';
            this.boards[ship.boardId].tiles[ship.row][ship.col].used = true;
            this.boards[ship.boardId].player.shipsToPlace--;
        });

        this.connessione.socket.on('switch player', () => {
            this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
        });

        this.connessione.socket.on('hit', (ship) => {
            this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'X';
        });

        this.connessione.socket.on('miss', (ship) => {
            this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'M';
        });

        this.connessione.socket.on('endGame', () => {
            this.endGame = true;
        });
    }

}
