var http = require("http"),
    util = require("util"),
    SocketIO = require("socket.io"),
    drone = require("dronestream"),
    arDrone = require("ar-drone"),
    client  = arDrone.createClient();

var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});

drone.listen(server);
server.listen(5555);

var io = SocketIO(server);
io.on("connection", function(socket){
  var stateUpdateTimeout = setTimeout(client.stop, 3000)
  if(client._lastState == 'CTRL_LANDED'){
    socket.emit('landed');
  }

  socket.on('droneState', function(state){
    client.stop();
    clearTimeout(stateUpdateTimeout);
    stateUpdateTimeout = setTimeout(client.stop, 3000);

    if(state.goingForward){
      client.front(0.5);
    }
    if(state.goingBack){
      client.front(-0.5);
    }
    if(state.turningLeft){
      client.clockwise(-0.5);
    }
    if(state.turningRight){
      client.clockwise(0.5);
    }
  });
});


