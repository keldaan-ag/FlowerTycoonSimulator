var express    = require('express');
var http       = require("http");
var cors       = require('cors');
var WebSocket  = require('ws');
var bodyParser = require("body-parser");
var delay      = require('delay');

var Terrain    = require('./terrain.js');
var Game       = require('./game.js');
var game;

const PORT     = process.env.PORT || 8081;

var app = express();
var server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/shared'));

/**
 * Lancement du serveur
 */
server.listen(PORT, function () {
  console.log('listening on port:', PORT);
  start();
});

// Routage du client vers la page principale
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(function bodyLog(req, res, next) {
  console.log(req.body);
  next();
});

/**
 * Partie du serveur qui repond au demande de plantation de vegetation sur une case
 */
app.post('/planter', function (req, res) {
  let json = {};
  if(game.checkName(req.body)){
    json = game.planter(req.body);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
  requestUpdateClients();
});

/**
 * Partie du serveur s occupant de l achat de cases
 */
app.post('/acheter', function (req, res) {
  let json = {};
  if(game.checkName(req.body)){
    json = game.acheter(req.body);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
  requestUpdateClients();
});

/**
 * Partie du serveur qui s occupe de la connexion de nouveaux joueurs, plus generalement de la connexion des utilisateurs
 */
app.post('/login', function (req, res) {
  res.json(game.login(req.body));
  requestUpdateClients();
});

/**
 * Partie du serveur repondant aux demandes d informations du client
 */
app.post('/getPlayers', function (req, res) {
  res.json(game.getPlayers());
});

app.post('/getInventory', function (req, res) {
  res.json(game.getInventory(req.body));
});

app.post('/getTerrain', function (req, res) {
  res.json(game.terrain.toJSON());
});


/**
 * Methode pour commencer une partie appele juste au dessus a la creation du serveur
 */
function start() {
  game = new Game(24,5,10);
  update();
}

function update(){
  delay(1000).then(() => {
    game.updateTerrain();
    update();
  });
}

// TODO: Change WebSocket to Socket.io


let wss = new WebSocket.Server({ server : server });
server.on('request', app);

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

function requestUpdateClients() {
    wss.broadcast(JSON.stringify({'reponse': 'update'}));
}