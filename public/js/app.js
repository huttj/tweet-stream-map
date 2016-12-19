const map = Map();
const tweets = Tweets();
const socket = Socket({ map, tweets });

socket.listen();