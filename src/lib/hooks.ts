import { socket } from "@/socket";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRegisterSocketEvent<F extends (...args: any[]) => any>(
  eventName: string,
  eventRegistration: F
) {
  useEffect(() => {
    socket.on(eventName, eventRegistration);

    return () => {
      socket.off(eventName, eventRegistration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
