import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import joinGame from "./events/join-game";
import {
  connectKafkaConsumer,
  connectKafkaProducer,
  subscribeTopic,
} from "./config/kafka.config";
import join from "./events/join";
import socketioEmit from "./topics/socketio-emit";
import auctionTimer from "./topics/auction-timer";

const port = parseInt(process.env.PORT || "3000");

async function main() {
  const io = new Server({
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", join(socket));
    socket.on("join-game", joinGame(socket));
  });

  io.listen(port);

  await connectKafkaProducer();
  await connectKafkaConsumer();
  await subscribeTopic("socketio-emit", socketioEmit(io));
  await subscribeTopic("auction-timer", auctionTimer(io));
}

main();
