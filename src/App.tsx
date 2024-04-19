import { useState, useEffect } from "react";
import { socket } from "./socket";
import ConnectionStatus from "./components/ConnectionStatus";

type RoomId = string;

function App() {
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roomIdToJoin, setRoomIdToJoin] = useState<RoomId>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const [cubeState, setCubeState] = useState<string[]>([]);
  const [queueState, setQueueState] = useState<string[]>([]);

  useEffect(() => {
    function onCreateRoomError({ message }: { message: string }) {
      setMessages((messages) => [...messages, `create_room_error: ${message}`]);
    }

    function onJoinRoom({
      roomId,
      cubeState: initialCubeState,
      queueState: initialQueueState,
    }: {
      roomId: RoomId;
      cubeState: string[];
      queueState: string[];
    }) {
      setRoomId(roomId);
      setCubeState(initialCubeState);
      setQueueState(initialQueueState);
      setMessages((messages) => [
        ...messages,
        `join_room_success: joined room ${roomId}`,
      ]);
    }

    function onJoinRoomError({ message }: { message: string }) {
      setMessages((messages) => [...messages, `join_room_error: ${message}`]);
    }

    socket.on("create_room_error", onCreateRoomError);
    socket.on("join_room_success", onJoinRoom);
    socket.on("join_room_error", onJoinRoomError);

    return () => {
      socket.off("create_room_error", onCreateRoomError);
      socket.off("join_room_success", onJoinRoom);
      socket.off("join_room_error", onJoinRoomError);
    };
  }, []);

  const createRoom = () => {
    console.log(socket.connected);
    console.log("creating room");
    socket.emit("create_room", {
      username: "Luiz",
      cubeState,
      queueState,
    });
  };

  const joinRoom = (roomId: RoomId) => {
    socket.emit("join_room", { roomId });
  };

  const sendMessage = () => {
    // socket.emit("send_message", { roomId, message: messageInput });
    console.log("not really disabled", roomId);
    setMessageInput("");
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-between p-4 relative">
      <ConnectionStatus />

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
        <div className="overflow-auto h-70vh mb-4">
          <div className="mb-4">
            <div className="bg-gray-200 px-4 py-2 rounded">
              Joined Room {roomId}
            </div>
            {messages.map((message, i) => (
              <div key={i} className="bg-gray-200 px-4 py-2 rounded mb-2">
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
          disabled={!roomId}
        />
        <button
          onClick={sendMessage}
          disabled={!roomId}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r disabled:bg-gray-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
