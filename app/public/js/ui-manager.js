(function () {
  "use strict";

  class UIManager {
    constructor() {
      this.loginManager     = null;
      this.userManager      = null;
      this.infoManager      = null;
      this.inventoryManager = null;
      this.actionsManager   = null;
      this.boardManager     = null;
      this.saleManager      = null;

      this.init();
    }

    init() {
      this.loginManager     = new LoginManager(null);
      this.userManager      = new UserManager(document.querySelector("#user-info"));
      this.infoManager      = new InfoManager(document.querySelector("#click-info"));
      this.inventoryManager = new InventoryManager(document.querySelector("#inventory"));
      this.actionsManager   = new ActionsManager(document.querySelector("#actions"));
      this.boardManager     = new BoardManager(document.querySelector("#leaderboard"));
      this.saleManager      = new SaleManager(document.querySelector("#sale"));
    }

    updateBoard(player_list) {
      //this.boardManager.displayBoard(player_list);
      this.boardManager.displayBoardTemp(player_list);
    }

    updateInventory(player) {
      this.inventoryManager.displayInventory(player);
      this.inventoryManager.displayMoney(player);
    }

    updateActions(actions) {
      this.actionsManager.setButtonState(actions);
    }

    displayInfo(msg){
      this.infoManager.clearInfo();
      this.infoManager.displayInfo(msg);
    }
    /**
    * Wrap common child method for a quicker access
    */
    toggleLogin() {
      this.loginManager.toggle();
    }

    toggleSale(bouquets){
      this.saleManager.toggle(bouquets);
    }

    setInfo(player) {
      this.userManager.setPlayerInfo(player);
    }

  }

  window.UIManager = UIManager;
})();
