import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

export interface Options {
    server: Server,
    path?: string //path en donde quiero 
}
export class WssService {
    private static _instance: WssService;
    private wss: WebSocketServer;


    private constructor(options: Options) {

        //server es el servidor de express
        const { server, path = '/ws' } = options  //localhost:3000/ws
        this.wss = new WebSocketServer({ server, path })
        this.start();

    }


    static initWebSocketServer(options: Options) {

        WssService._instance = new WssService(options)

    }

    static get instance(): WssService {
        if (!WssService._instance) throw 'WssService is not initialized'

        return WssService._instance;

    }

    public start() {
        this.wss.on('connection', (ws: WebSocket) => {

            console.log('Client connected');

            ws.on('close', () => console.log('disconected'))


        })
    }

    public sendMessage(type: string, payload: any){
        this.wss.clients.forEach(c=>{

            if(c.readyState===WebSocket.OPEN) c.send(JSON.stringify({type, payload: payload}))
        })

    }
}