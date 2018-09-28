import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    socket = null;      // socket che si connette al server socket.io
    connectionId = -1;

    constructor() {
        this.socket = socketIo('http://localhost:3000');
    }

}
