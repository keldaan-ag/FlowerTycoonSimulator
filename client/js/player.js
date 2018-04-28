/**
 * La classe Player regroupe toutes les actions possibles du joueur du coté client 
 * //TODO faire les actions récolter, fertiliser, acheter
 */
class Player{
    /**
     * Le joueur peut décider de sélectionner une case pour faire une action. Par défaut, aucune case  n'est sélectionné
     */
    constructor(){
        this.selectedCase = 0;
    }
    /**
     * Méthode appelé pour signaler un changement de case sélectionné par le joueur
     * @param {Case} parcelle 
     */
    update(parcelle){
        this.selectedCase = parcelle;
    }
    /**
     * Méthode appelé pour demander au serveur s'il est possible de planter. Si le serveur renvoie une réponse affirmative, on peut alors 
     * déclencher la méthode plante de la case.
     * self représenté l'objet lui même car en JS le this change selon la portée (YOUHOU)
     * //TODO passer en argument de la méthode planter une graine spécifique
     */
    planter(self) {
        
        console.log(self);
        send("planter",JSON.stringify(
            {
                "fonction": "planter",
                "param": {
                    "x": self.selectedCase.x,
                    "y": self.selectedCase.y
                }
            }
        )).then(function(response){
            if(response.ok) {
                response.json().then(function(json) {
                    console.log(json);
                    if(json.reponse == 1){
                        console.log(self.selectedCase.x,self.selectedCase.y);
                        terrain.cases[self.selectedCase.x][self.selectedCase.y].plante();
                    }
                });
            }} 
        )
    };
}