var http = require("http"),
    drone = require("dronestream"),
    arDrone = require("ar-drone");
    client  = arDrone.createClient();

var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);

  client.takeoff();

  client
  .after(6000, function(){
    console.log(this);
    this.clockwise(0.5);
  })
  .after(3000, function(){
    this.stop();
    this.land();
  });
});

drone.listen(server);
server.listen(7555);


