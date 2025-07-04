import React from "react";
import { socket } from "../socket";
import { useAtom } from "jotai";
import { connectionAtom } from "@/store/connection";
import { useRegisterSocketEvent } from "@/lib/hooks";

const ConnectionStatus: React.FC = () => {
  const [connected, setConnected] = useAtom(connectionAtom);

  useRegisterSocketEvent("connect", function onConnect() {
    setConnected(true);
  });
  useRegisterSocketEvent("disconnect", function onDisconnect() {
    setConnected(false);
  });
  useRegisterSocketEvent("connect_error", function onConnectError<T>(error: T) {
    console.error(error);
  });

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
