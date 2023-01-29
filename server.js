const { Server } = require("net");
var colors = require('colors')

const host = "0.0.0.0";
const END = "END";

const connections = new Map();
const usernNames = new Set();
const error = (message) => {
  console.error(message);
  process.exit(1);
};

const sendMessage = (message, origin) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

const listen = (port) => {
  const server = new Server();

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Nueva conexion desde:  ${remoteSocket}`.green);
    socket.setEncoding("utf-8");

    socket.on("data", (message) => {
      connections.values();
      
      if (!connections.has(socket)) {
        if(usernNames.has(message)){
          console.log('Error, este usuario ha sido registrado anteriormente'.red);
          socket.end();
        }else{
          console.log(`Usuario ${message} conectado desde:  ${remoteSocket}`.green);
          connections.set(socket, message);
          usernNames.add(message);
        }
        
      } else if (message === END) {
        connections.delete(socket);
        socket.end();
      } else {
        const fullMessage = `[${connections.get(socket)}]`.magenta.underline+":"+` ${message}`.blue;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        sendMessage(fullMessage, socket);
      }
    });

    socket.on("error", (err) => console.error(err));

    socket.on("close", () => {
      console.log(colors.red(`Conexion con: ${remoteSocket} finalizada`));
    });
  });

  server.listen({ port: 8000, host: '0.0.0.0' }, () => {
    console.log(`Conectado desde el puerto: 8000`.bgGreen);
  });

  server.on("error", (err) => error(err.message));
};

const main = () => {
  
  listen();
};

if (require.main === module) {
  main();
}