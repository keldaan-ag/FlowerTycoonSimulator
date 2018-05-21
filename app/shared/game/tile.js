(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var FlowerFactory;
  if(isNode) {
    FlowerFactory = require('./flower.js').FlowerFactory;

  }
  else {
    FlowerFactory = window.FlowerFactory;
  }

  class Tile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 40;
      this.type = "";
    }

    getType() {
      return this.type;
    }
  }

  class TileEmpty extends Tile {
    constructor(x, y) {
      super(x, y);
      this.type = "empty";
      this.cost = 10;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
      ctx.strokeRect(this.x*this.size, this.y*this.size, this.size, this.size);
    }

    getAvailableActions() {
      return {
        plant: false,
        harvest: false,
        fertilize: false,
        buy: true
      };
    }
  }

  class TileBought extends Tile {
    constructor(x, y, owner) {
      super(x, y);
      this.type = "bought";
      this.owner = owner;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      ctx.strokeStyle = this.owner.color;
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
      ctx.fillStyle = "#fff";
      ctx.fillRect(this.x*this.size+4, this.y*this.size+4, this.size-8, this.size-8);
    }

    getAvailableActions() {
      return {
        plant: true,
        harvest: false,
        fertilize: true,
        buy: false
      };
    }
  }

  class TileSeeded extends TileBought {
    constructor(x, y, owner, flower) {
      super(x, y, owner);
      this.type = "seeded";
      this.flower = flower;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      ctx.strokeStyle = owner.color;
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
      ctx.fillStyle = "#bb8044";
      ctx.fillRect(this.x*this.size+4, this.y*this.size+4, this.size-8, this.size-8);

      this.flower.draw(ctx, (this.x+0.5)*this.size, (this.y+0.5)*this.size);
    }

    getAvailableActions() {
      return {
        plant: false,
        harvest: true,
        fertilize: true,
        buy: false
      };
    }
  }



  var TileFactory = {
    TILES: ["empty", "bought", "seeded"]
  };
  TileFactory.prototype = {
    createTile: function (tile_data, game) {
      let tile, player;
      let tile_id = TileFactory.TILES.indexOf(tile_data.type);

      switch(tile_id) {
        case 0:
          tile = new TileEmpty(tile_data.x, tile_data.y);
          break;

        case 1:
          //console.log(tile_data);
          if(game.checkID(tile_data.owner.id)) {
            player = game.findPlayerById(tile_data.owner.id);
            tile = new TileBought(tile_data.x, tile_data.y, player);
          }
          else {
              //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
              tile = null;
          }
          break;

        case 2:
          if(playerManager.checkPlayer(tile_data.owner.name)) {
              player = playerManager.findPlayer(tile_data.owner.name);
              let plante = FlowerFactory.createPlante(tile_data.plant);
              object = new TileSeeded(tile_data.x, tile_data.y, player, plante);
          }
          else{
              //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
              tile = null;
          }
          break;
      }
      return tile;
    }
  }


  // Node export
  if (isNode) {
    module.exports = {
      Tile: Tile,
      TileEmpty: TileEmpty,
      TileBought: TileBought,
      TileSeeded: TileSeeded,
      TileFactory: TileFactory
    };
  }
  // Browser export
  else {
    window.Tile = Tile;
    window.TileEmpty = TileEmpty;
    window.TileBought = TileBought;
    window.TileSeeded = TileSeeded;
    window.TileFactory = TileFactory;
  }
})();
