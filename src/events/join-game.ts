import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import verifyToken from "../utils/verify-token";
import { socketPlayerMap } from "../store";

export default function joinGame(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  return async (payload: { token: string; gameId: string }) => {
    const playerId = verifyToken(payload.token);
    if (!playerId) {
      socket.disconnect();
      return;
    }
    socket.join(payload.gameId);
    socket.to(payload.gameId).emit("player-join-game", playerId);
  };
}
