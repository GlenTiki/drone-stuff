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
  client.disableEmergency();
  
  var stateUpdateTimeout = setTimeout(client.stop, 3000)
  if(client._lastState == 'CTRL_LANDED'){
    socket.emit('landed');
  }
  setInterval(function(){
    if(client._lastState == 'CTRL_LANDED'){
      socket.emit('landed');
    }
  }, 5000);

  socket.on('takeoff', function(){
    console.log('takeoff');
    client.takeoff();
  });

  socket.on('droneState', function(state){
    clearTimeout(stateUpdateTimeout);
    stateUpdateTimeout = setTimeout(client.stop, 3000);
    
    if(state.LAND){
      client.land();
      setTimeout(function(){
        socket.emit('landed');
      }, 5000);
      return;
    }

    if(!state.goingForward || !state.goingBack){
      client.front(0);
    }
    if(!state.goingLeft || !state.goingRight){
      client.left(0);
    }
    if(!state.turningLeft || !state.turningRight){
      client.clockwise(0);
    }
    if(!state.rising || !state.falling){
      client.up(0);
    }
    
    if(state.goingForward){
      client.front(0.5);
    }
    if(state.goingBack){
      client.front(-0.5);
    }
    if(state.goingLeft){
      client.left(0.5);
    }
    if(state.goingRight){
      client.left(-0.5);
    }
    if(state.turningLeft){
      client.clockwise(-0.5);
    }
    if(state.turningRight){
      client.clockwise(0.5);
    }
    if(state.rising){
      client.up(0.5)
    }
    if(state.falling){
      client.up(-0.5)
    }
  });
});


