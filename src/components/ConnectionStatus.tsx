import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket";

const ConnectionStatus = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Server events, debugging purposes
    function onConnectEvent() {
      setConnected(true);
    }

    function onDisconnectEvent() {
      setConnected(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onConnectErrorEvent(error: any) {
      console.error(error);
    }

    socket.on("connect", onConnectEvent);
    socket.on("disconnect", onDisconnectEvent);
    socket.on("connect_error", onConnectErrorEvent);

    return () => {
      socket.off("connect", onConnectEvent);
      socket.off("disconnect", onDisconnectEvent);
      socket.off("connect_error", onConnectErrorEvent);
    };
  }, []);

  const toggleConnection = () => {
    if (connected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  };

  return (
    <div
      className="flex items-center absolute top-2 right-3 cursor-pointer gap-1"
      onClick={toggleConnection}
    >
      <p>Connection</p>
      <div
        className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
      ></div>
    </div>
  );
};

export default ConnectionStatus;
