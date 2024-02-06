import { EachMessageHandler } from "kafkajs";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendTopic } from "../config/kafka.config";

export default function auctionTimer(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): EachMessageHandler {
  return async ({ topic, partition, message }) => {
    const { auctionId, gameId } = JSON.parse(message.value!.toString());
    let i = 20;
    const intervalId = setInterval(() => {
      if (i == 0) {
        sendTopic("auction-timer-complete", { auctionId });
        clearInterval(intervalId);
      }
      if (i <= 10) {
        io.to(gameId).emit("auction-timer", i);
      }
      i--;
    }, 1 * 1000);
  };
}
