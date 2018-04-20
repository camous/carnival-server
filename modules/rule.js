/**
 * Load global rules
 * @param {JSON} carnival 
 */
function initializeCarnival(carnival){
    
    for(var id in Object.keys(carnival.game.teams)){
        var key = Object.keys(carnival.game.teams)[id];
        carnival.game.teams[key].remaining_resource = carnival.game.rules.resources_per_team;
    }
}

module.exports.initializeCarnival = initializeCarnival;