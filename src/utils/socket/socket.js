import io from "socket.io-client";

const socket = io.connect("http://localhost:8017");
// const socket = io.connect("https://be-meelo-note.onrender.com");

export default socket;
