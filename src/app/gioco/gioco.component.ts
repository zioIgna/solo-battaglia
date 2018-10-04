import { element } from 'protractor';
import { Ship } from './ship.model';
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

    boards: BoardComponent[] = [];
    boardSize = 10;
    currPlayer = 0;
    playersNumber = 2;
    hits = 0;
    loggedPlayers = 0;
    positionedShips = 0;
    orientation = 'vertical';
    endGame = false;
    hitsToWin = 0;
    // numRow = 4;
    // numCol = 4;
    // winner: number;
    // grid: any[] = [];
    // gridValues: any[] = [];

    constructor(private connessione: ConnectionService) { }

    initializeGame() {  // funz non utilizzata
        if (this.loggedPlayers === 2) {
            this.createBoards();
        }
        // this.placeShips();
    }

    createBoards() {    // invocata da onInit al verificarsi di condizione: loggedPlayers === 2
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
                tiles[i][j] = { used: false, value: '0', shipId: '' };
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
        alert('La casella è: ' + JSON.stringify(id) + ' used: ' + JSON.stringify(tile.used) + ' shipId: ' + tile.shipId);
        // ci sono ancora navi da posizionare (per almeno uno dei giocatori) -> questa condizione va rivista perché
        // il client non può conoscere se ci sono ancora navi da piazzare nell'altro client
        // if (this.boards[this.currPlayer].player.shipsToPlace || this.boards[(this.currPlayer + 1) % this.playersNumber]
        //     .player.shipsToPlace) {
        if (this.positionedShips < 2) {
            // verifico corrispondenza tra chi fa la mossa e la griglia del giocatore: ... in realtà non serve
            // if (this.currPlayer === this.connessione.connectionId) {
            // if (+boardId === this.currPlayer && this.boards[this.currPlayer].player.shipsToPlace) { // si posizionano le navi
            // si posizionano le navi:
            // if (+boardId === this.connessione.connectionId && this.boards[this.currPlayer].player.shipsToPlace) {
            if (+boardId === this.connessione.connectionId && this.boards[this.connessione.connectionId].player.shipsToPlace.length) {
                // this.boards[this.currPlayer].tiles[row][col].value = 'U';
                // this.boards[this.currPlayer].tiles[row][col].used = true;
                if (this.checkPositioning(+boardId, row, col, +(this.boards[this.connessione.connectionId].player.shipsToPlace[0].size),
                    this.orientation)) {
                    // this.addShip(row, col, this.boards[this.connessione.connectionId].player.shipsToPlace[0], this.orientation);
                    const coordinates = {
                        boardId: boardId,
                        row: row,
                        col: col,
                        shipId: this.boards[this.connessione.connectionId].player.shipsToPlace[0].id,
                        size: this.boards[this.connessione.connectionId].player.shipsToPlace[0].size,
                        orientation: this.orientation
                    };
                    console.log(coordinates);
                    this.connessione.socket.emit('new ship', coordinates);
                    const lastShip = this.boards[this.connessione.connectionId].player.shipsToPlace.shift();
                    this.boards[this.connessione.connectionId].player.opponentShips.push(lastShip);
                } else {
                    console.log('Posizionamento impossibile, seleziona un\'altra casella');
                }
                // this.boards[this.connessione.connectionId].tiles[row][col].used = true;
                // this.connessione.socket.emit('new ship', ship);
                // this.boards[this.currPlayer].player.shipsToPlace--;
                // this.boards[this.connessione.connectionId].player.shipsToPlace--;
                // console.log('l\' attuale giocatore è: ' + this.currPlayer + ' ' + this.boards[this.currPlayer].player.shipsToPlace
                //     .forEach(function (element) {
                //         return element.size;
                //     })
                //     );
                // console.log('l\'attuale giocatore è: ' + this.currPlayer);
                if (this.boards[this.connessione.connectionId].player.shipsToPlace.length) {
                    console.log('Ti rimangono da posizionare le seguenti navi:');
                }
                this.boards[this.connessione.connectionId].player.shipsToPlace.forEach(function (item) {
                    console.log(item.id);
                });
                // if (!this.boards[this.currPlayer].player.shipsToPlace) {
                if (!this.boards[this.connessione.connectionId].player.shipsToPlace.length) {
                    // this.currPlayer++;
                    // this.connessione.socket.emit('switch player');
                    // this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
                    // console.log('l\' attuale giocatore è: ' + this.currPlayer + ' ' + this.boards[this.currPlayer]
                    // .player.shipsToPlace);
                    this.connessione.socket.emit('navy positioned');
                }
                // +boardId === this.connessione.connectionId &&    // eliminato da condizione riga sotto
            } else if (!this.boards[this.connessione.connectionId].player.shipsToPlace.length) {
                console.log('Attendi che anche l\'altro giocatore abbia posizionato le sue navi');
            } else {
                console.log('Devi posizionare le navi sulla tua griglia, che è l\'altra...');
            }
            // } else {
            //     console.log('It\'s not your turn to play');     // il giocatore che ha selezionato la casella non ha rispettato il turno
            // }
        } else {    // si comincia a sparare
            if (this.currPlayer === this.connessione.connectionId) {
                if (+boardId !== this.currPlayer) {     // sto sparando nella griglia dell'avversario
                    if (this.boards[boardId].tiles[row][col].value === 'X' || this.boards[boardId].tiles[row][col].value === 'M') {
                        console.log('Hai già sparato su questa casella, spara di nuovo!');
                    } else {
                        // if (this.boards[boardId].tiles[row][col].value === 'U') {
                        if (this.boards[boardId].tiles[row][col].used === true) {
                            this.boards[boardId].tiles[row][col].value = 'X';
                            // typecast a any per aggiungere un campo a ship:
                            // (ship as any).shipId = this.boards[boardId].tiles[row][col].status;
                            // oppure metodo alternativo per aggiungere un campo a un oggetto già definito:
                            ship['shipId'] = this.boards[boardId].tiles[row][col].shipId;
                            const hitShip = this.boards[boardId].tiles[row][col].shipId;
                            const hitShipIndex = this.boards[this.currPlayer].player.opponentShips.findIndex((item) => item.id === hitShip);
                            // console.log(hitShip + ' hits rimasti: ' + this.boards[this.currPlayer]
                            // .player.opponentShips[hitShipIndex].hits);
                            this.connessione.socket.emit('hit', ship);
                            // this.boards[this.currPlayer].player.opponentShips[id[hitShip]].
                            // this.boards[this.currPlayer].player.opponentShips[id[hitShip]].hits--;
                            // if (!this.boards[this.currPlayer].player.opponentShips[id[hitShip]].hits) {
                            if (--this.boards[this.currPlayer].player.opponentShips[hitShipIndex].hits === 0) {
                                // if (this.boards[this.currPlayer].player.opponentShips.find(item => item.id === hitShip).hits-- === 0) {
                                console.log('Hai affondato la nave ' + hitShip);
                            }
                            this.boards[this.currPlayer].player.score++;
                            if (this.boards[this.currPlayer].player.score === this.hitsToWin) {
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
                        }
                        // } else {
                        //     console.log('Hai già sparato su questa casella, spara di nuovo!');
                        // }
                    }
                } else {        // sto sparando nella mia griglia: errore
                    console.log('Devi sparare nell\'altra griglia!');
                }
            } else {
                console.log('It\'s not your turn to play');     // il giocatore che ha selezionato la casella non ha rispettato il turno
            }
        }
    }

    checkPositioning(boardId: number, row: number, col: number, size: number, orientation: string) {
        if (size === 1) {
            return this.boards[boardId].tiles[row][col].used === false;
        } else if (orientation === 'horizontal') {
            return +col + size <= this.boardSize && this.boards[boardId].tiles[row][col].used === false
                && this.checkPositioning(boardId, row, +col + 1, size - 1, orientation);
        } else {
            return +row + size <= this.boardSize && this.boards[boardId].tiles[row][col].used === false
                && this.checkPositioning(boardId, +row + 1, col, size - 1, orientation);
        }
    }

    addShip(boardId: number, row: number, col: number, shipId: number, size: number, orientation: string) {
        if (size === 1) {
            this.boards[boardId].tiles[row][col].used = true;
            this.boards[boardId].tiles[row][col].shipId = shipId;
        } else if (orientation === 'horizontal') {
            this.boards[boardId].tiles[row][col].used = true;
            this.boards[boardId].tiles[row][col].shipId = shipId;
            this.addShip(boardId, row, +col + 1, shipId, size - 1, orientation);
        } else {
            this.boards[boardId].tiles[row][col].used = true;
            this.boards[boardId].tiles[row][col].shipId = shipId;
            this.addShip(boardId, +row + 1, col, shipId, size - 1, orientation);
        }
    }

    setHorizontal() {
        this.orientation = 'horizontal';
    }

    setVertical() {
        this.orientation = 'vertical';
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

    // sumShipSize(arr: Ship[]) {

    // }

    ngOnInit() {
        // this.connessione.getConnection();
        // this.initializeGame();
        // this.initialize2();
        // this.placeShip();

        // this.connessione.socket.on('new connection', (numPlayers) => {
        this.connessione.socket.on('new connection', (info) => {
            this.loggedPlayers = info.loggedPlayers;
            console.log('the players number is: ' + this.loggedPlayers);
            // console.log('endgame = ' +  this.endGame);

            if (this.connessione.connectionId === -1) {
                // this.connessione.connectionId = this.loggedPlayers - 1;
                this.connessione.connectionId = info.av0 ? 0 : 1;
                console.log('my connectionId is: ' + this.connessione.connectionId);
            }

            // if (numPlayers.loggedPlayers === 2 && this.boards.length < 2) {    // this.boards !== null &&
            if (info.loggedPlayers === 2 && this.boards.length < 2) {    // this.boards !== null &&
                console.log('finally 2 logged players!');
                // this.gioco.initializeGame();
                this.createBoards();
                // this.hitsToWin = Object.keys(this.boards[this.connessione.connectionId].player.shipsToPlace)
                //     .reduce(function (previous, key) {
                //         return previous + this.boards[this.connessione.connectionId].player.shipsToPlace[key].size;
                //     }, 0);
                for (const ship of this.boards[this.connessione.connectionId].player.shipsToPlace) {
                    this.hitsToWin += ship.size;
                }
                console.log('hitsToWin = ' + this.hitsToWin);
            }
        });

        this.connessione.socket.on('user disconnected', (info) => {
            this.loggedPlayers = info;
            this.boards = [];
            this.positionedShips = 0;
            this.hitsToWin = 0;
            this.connessione.socket.emit('checkAvailability', this.connessione.connectionId);
        });

        this.connessione.socket.on('new ship', (coordinates) => {
            // this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'U';
            // this.boards[ship.boardId].tiles[ship.row][ship.col].used = true;
            // this.boards[ship.boardId].player.shipsToPlace--;
            this.addShip(
                coordinates.boardId, coordinates.row, coordinates.col, coordinates.shipId, coordinates.size, coordinates.orientation
            );
        });

        this.connessione.socket.on('navy positioned', () => {
            this.positionedShips++;
            console.log('Posizionate ' + this.positionedShips + ' flotte');
        });

        this.connessione.socket.on('switch player', () => {
            this.currPlayer = (this.currPlayer + 1) % this.playersNumber;
            console.log('l\' attuale giocatore è: ' + this.currPlayer);
        });

        this.connessione.socket.on('hit', (ship) => {
            this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'X';
        });

        this.connessione.socket.on('miss', (ship) => {
            this.boards[ship.boardId].tiles[ship.row][ship.col].value = 'M';
        });

        this.connessione.socket.on('endGame', () => {
            this.endGame = true;
            this.loggedPlayers = 0;
            this.hits = 0;
            this.boards = [];
            this.positionedShips = 0;
        });
    }

}
