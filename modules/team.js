var _ = require('lodash');

function getAvailableTerritory(territories) {
    var territorieslist = Object.keys(territories);
    var territory = null;
    do {
        territory = territorieslist[Math.floor(Math.random() * territorieslist.length)];
    }while(territories[territory].meta !== undefined && territories[territory].meta.team !== undefined);

    return territory;
}

function dispatchTeamResources(carnival, team){
    var remaining_resources = carnival.game.teams[team].remaining_resource;
    var min = carnival.game.rules.min_per_territory;
    var max = carnival.game.rules.max_per_territory;
    
    do {
        if(remaining_resources === 0)
            continue;
    
        var rndres = Math.floor(Math.random() * max-min+1) + min;
        remaining_resources-=rndres;
    
        if(remaining_resources<=0) {
            rndres = remaining_resources+rndres;
            remaining_resources = 0;
        }
    
        var territory = getAvailableTerritory(carnival.territories);
        _.merge(carnival.territories[territory], { 'meta' :  {'team' : team,'count' : rndres }});
        console.log(team + '\t' + territory + '\t' + rndres + '/' + remaining_resources );
    }while(remaining_resources>0);
    
    carnival.game.teams[team].remaining_resource = remaining_resources;
}

module.exports.getAvailableTerritory = getAvailableTerritory;
module.exports.dispatchTeamResources = dispatchTeamResources;