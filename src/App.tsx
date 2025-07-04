import { useState, useEffect } from "react";
import { socket } from "./socket";
import ConnectionStatus from "./components/ConnectionStatus";
import ErrorAlert from "./components/ErrorAlert";
import { useAtomValue } from "jotai";
import { connectionAtom } from "./store/connection";
import { useRegisterSocketEvent } from "./lib/hooks";

type RoomId = string;

function App() {
  const connected = useAtomValue(connectionAtom);
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roomIdToJoin, setRoomIdToJoin] = useState<RoomId>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const [cubeState, setCubeState] = useState<string[]>([]);
  const [queueState, setQueueState] = useState<string[]>([]);

  useRegisterSocketEvent(
    "create_room_error",
    function onCreateRoomError({ message }: { message: string }) {
      setErrors((errors) => [...errors, message]);
    }
  );
  useRegisterSocketEvent(
    "join_room_success",
    function onJoinRoom({
      roomId,
      cubeState: initialCubeState,
      queueState: initialQueueState,
      username,
    }: {
      roomId: RoomId;
      cubeState: string[];
      queueState: string[];
      username: string;
    }) {
      setRoomId(roomId);
      setCubeState(initialCubeState);
      setQueueState(initialQueueState);
      setMessages((messages) => [
        ...messages,
        `join_room_success: ${username} just joined!`,
      ]);
    }
  );
  useRegisterSocketEvent(
    "join_room_error",
    function onJoinRoomError({ message }: { message: string }) {
      setErrors((errors) => [...errors, message]);
    }
  );

  useEffect(() => {
    if (roomId && !connected) {
      setRoomId(null);
      setMessages([]);
    }
  }, [roomId, connected]);

  const createRoom = () => {
    socket.emit("create_room", {
      username,
      cubeState,
      queueState,
    });
  };

  const joinRoom = (roomId: RoomId) => {
    socket.emit("join_room", { roomId, username });
  };

  const sendMessage = () => {
    // socket.emit("send_message", { roomId, message: messageInput });
    setMessageInput("");
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-between p-4 relative">
      <ConnectionStatus />
      <ErrorAlert errors={errors} onClose={() => setErrors([])} />

      <div className="text-9xl bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text font-mono">
        Rubik's chat
      </div>

      {!roomId && (
        <div className="flex flex-col w-1/4 gap-2">
          <input
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded"
            placeholder="Choose a name"
          />
          <div className="flex gap-2">
            <button
              onClick={createRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              Create Room
            </button>
            <button
              onClick={() => joinRoom(roomIdToJoin)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              Join Room
            </button>
          </div>
          <input
            value={roomIdToJoin}
            onChange={(e) => setRoomIdToJoin(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded"
            placeholder="Enter Room ID to Join"
          />
        </div>
      )}

      {roomId && (
        <div className="overflow-auto h-full w-full p-4 bg-gray-600 rounded">
          <div className="mb-4">
            <div className="bg-green-700 px-4 py-2 rounded">
              Joined Room {roomId}
            </div>
            {messages.map((message, i) => (
              <div key={i} className="bg-gray-700 px-4 py-2 rounded mb-2 ">
                {message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="border border-gray-300 px-4 py-2 w-full rounded-l"
          placeholder="Type your move..."
          disabled={!roomId || !connected}
        />
        <button
          onClick={sendMessage}
          disabled={!roomId || !connected}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r disabled:bg-gray-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
