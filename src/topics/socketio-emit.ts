import { EachMessageHandler } from "kafkajs";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendTopic } from "../config/kafka.config";

export default function socketioEmit(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): EachMessageHandler {
  return async ({ topic, partition, message }) => {
    const data: { rooms: string[]; event: string; payload: any } = JSON.parse(
      message.value!.toString()
    );
    if (data.event == "player-turn") {
      let i = 60;
      const intervalId = setInterval(() => {
        if (i == 0) {
          sendTopic("player-timer-complete", {
            playerId: data.rooms[0],
            gameId: data.payload.gameId,
          });
          clearInterval(intervalId);
        }
        if (i <= 10) {
          io.to(data.rooms).emit("player-timer", i);
        }
        i--;
      }, 1 * 1000);
    }
    if (data.rooms.length) {
      io.to(data.rooms).emit(data.event, data.payload);
    } else {
      io.emit(data.event, data.payload);
    }
  };
}
