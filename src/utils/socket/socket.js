import io from "socket.io-client";

const socket = io.connect("http://localhost:8017");

export default socket;
