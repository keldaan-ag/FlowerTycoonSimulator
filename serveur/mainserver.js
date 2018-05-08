const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");
var Terrain = require('./terrain.js');
var Game = require('./game.js');

var game;

const app = express()

app.use(cors())
app.use(bodyParser.json());

/**
 * Partie du serveur qui repond au demande de plantation de vegetation sur une case
 */
app.post('/planter', function (req, res) {
  console.log(req.body);
  let json = {};
  if(game.checkName(req.body)){
    json = game.planter(req);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
})

/**
 * Partie du serveur s occupant de l achat de cases
 */
app.post('/acheter', function (req, res) {
  console.log(req.body);
  let json = {};
  if(game.checkName(req.body)){
    json = game.acheter(req.body);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
})

/**
 * Partie du serveur qui s occupe de la connexion de nouveaux joueurs, plus generalement de la connexion des utilisateurs
 */
app.post('/login', function (req, res) {
  console.log(req.body);
  res.json(game.login(req.body));
})

/**
 * Partie du serveur repondant aux demandes d informations du client
 */
app.post('/getPlayers', function (req, res) {
  console.log(req.body);
  res.json(game.getPlayers());
})

app.post('/getInventory', function (req, res) {
  console.log(req.body);
  res.json({"inventory": [
    {type : "seed", name : "Graine de tulipe"},
    {type : "flower", name : "Fleur de tournesol"}
  ]})
})

app.post('/getTerrain', function (req, res) {
  console.log(req.body);
  res.json(game.terrain.toJSON());
})

/**
 * Methode lancant le serveur
 */
app.listen(8081, function () {
  start();
  console.log('listening on port 8081!');
})

/**
 * Methode pour commencer une partie appele juste au dessus a la creation du serveur
 */
function start() {
    game = new Game(24,5,10);
}