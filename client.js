const { Socket } = require("net");
var colors = require('colors')
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const END = "END";

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const connect = (host, port) => {
  console.log(`Conectando desde ${host}:${port}`.green);

  const socket = new Socket();
  socket.connect({ host, port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("Conectado".green);

    readline.question("Escoge tu nombre de usuario: ", (username) => {
      socket.write(username);
      console.log(`Escribe el mensaje que quieras enviar, escribe ${END} para desconectarte del chat`.yellow);
    });

    readline.on("line", (message) => {
      socket.write(message);
      if (message === END) {
        socket.end();
      }
    });

    socket.on("data", (data) => {
      console.log(data);
    });
  });

  socket.on("error", (err) => error(err.message));

  socket.on("close", () => {
    console.log("Desconectado".red);
    process.exit(0);
  });
};

const main = () => {
  if (process.argv.length !== 4) {
    error(`Usage: node ${__filename} host port`);
  }

  let [, , host, port] = process.argv;
  if (isNaN(port)) {
    error(`Puerto invalido ${port}`.red);
  }
  port = Number(port);

  connect(host, port);
};

if (module === require.main) {
  main();
}

