import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import verifyToken from "../utils/verify-token";
import { socketPlayerMap } from "../store";

export default function join(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  return async (token: string) => {
    const playerId = verifyToken(token);
    if (!playerId) {
      socket.disconnect();
      return;
    }
    socket.join(playerId);
    socketPlayerMap[socket.id] = playerId;
  };
}
