var connect = require("connect");
var nowjs = require("now");
var redis = require("redis"),
  client = redis.createClient();

var server = connect()
  .use(connect.favicon())
  .use(connect.logger())
  .use(connect.static("public"))
  .listen(8888);

var chat = nowjs.initialize(server);

client.del("names", redis.print);
client.del("messages", redis.print);

chat.connected(function() {
  console.log("Connected => ", this.now.name);

  chat.now.addName(this.now.name);

  var self = this;

  client.lrange("messages", 0, -1, function(err, replies) {
    console.log("Messages length => ", replies.length);

    replies.forEach(function(reply, i) {
      var msg = JSON.parse(reply.toString());
      self.now.receiveMessage(msg.time, msg.name, msg.text);
    });
  });

  client.lrange("names", 0, -1, function(err, replies) {
    console.log("Names length => ", replies.length);

    replies.forEach(function(reply, i) {
      self.now.addName(reply.toString());
    });
  });

  client.lpush("names", this.now.name);
});

chat.now.distributeMessage = function(message) {
  var msg = {
    time: new Date().toLocaleTimeString(),
    name: this.now.name,
    text: message
  }

  chat.now.receiveMessage(msg.time, msg.name, msg.text);

  client.lpush("messages", JSON.stringify(msg));
};