import io from "socket.io-client";

// Configure connection options
const options = {
  // autoConnect: false, // Disable auto connection
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts
  reconnectionDelay: 1000, // Delay between attempts in milliseconds
  reconnectionDelayMax: 5000, // Maximum delay between attempts
};

export const socket = io("http://localhost:3000", options); // replace with your server address
