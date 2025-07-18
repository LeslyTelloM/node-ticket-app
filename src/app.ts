import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/service/wss.service';


(async () => {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT, //inicilizar las rutas despues de que ws este activo
  });

  //Misma confifuracion del servidor express
  const httpServer = createServer(server.app);
  WssService.initWebSocketServer({ server: httpServer })


  //Inicializar las rutas despues
  server.setRoutes(AppRoutes.routes)

  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on port ${envs.PORT}`)
  })

}