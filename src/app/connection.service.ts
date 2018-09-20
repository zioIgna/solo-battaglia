import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {
    socket = null;      // socket che si connette al server socket.io

    getConnection() {
        if (this.socket === null) {
            this.socket = socketIo('http://localhost:3000');
        }
    }


}
