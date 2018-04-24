var _ = require('lodash');
var game = require('../modules/game');
/**
 * Calculate objective cost
 * @param {*} carnival 
 * @param {*} objective 
 */
function getObjectiveCost(carnival, objective) {
    return carnival.game.rules.cost_per_objective + objective.resource;
}

/**
 * Calculate cost of all objectives
 * @param {*} carnival 
 * @param {*} objectives 
 */
function getAllObjectivesCost(carnival, objectives){
    var cost = 0;
    _.forEach(objectives, function(value, key){
        cost += getObjectiveCost(carnival, value);
    });

    return cost;
}

function deleteObjective(carnival, team, roundid, objectiveid){
    var teamobjectives = carnival.game.rounds[roundid-1].objectives[team];
    var deletedobject = teamobjectives[objectiveid];
    teamobjectives.splice(objectiveid,1);

    carnival.game.rounds[roundid-1].objectives[team] = teamobjectives;

    return deletedobject;
}

function move(carnival, team, count, from, to){
    if(to === undefined || to === null){
        return;
    }

    var fromterritory = carnival.territories[from];
    
    if(fromterritory.meta.count !== undefined && fromterritory.meta.count[team] !== undefined){
        if(fromterritory.meta.count[team] < count)
            count = fromterritory.meta.count[team];

        fromterritory.meta.count[team] -= count;
    }
    else{
        console.log('no body');
    }
    
    var toterritory = carnival.territories[to];
    var before = _.cloneDeep(toterritory);

    // nobody here
    if(toterritory !== undefined && toterritory.meta.count === undefined){
        toterritory['meta']['count'] = {};
        toterritory['meta']['count'][team] = count;
    }

    for(var id in Object.keys(toterritory.meta.count)){
        var teamto = Object.keys(toterritory.meta.count)[id];

        // are we in a non objective ?
        if(carnival.game.teams[teamto].nonobjectives.indexOf(to) !== -1)
        {
            toterritory.meta.count[teamto] = 0;
            toterritory.meta.count[team] = count;
        } else {
            if(team !== teamto) {
                var ratio = getStakeHolderImpactRatio(carnival, team, teamto);
                
                if(ratio > 1){
                    toterritory.meta.count[teamto] = Math.ceil(toterritory.meta.count[teamto]*ratio);
                    toterritory.meta.count[team] = Math.ceil((toterritory.meta.count[team] + count)*ratio);
                }
                else if (ratio < 1){
                    toterritory.meta.count[teamto] = Math.floor(toterritory.meta.count[teamto]*ratio);
                    toterritory.meta.count[team] = Math.floor((toterritory.meta.count[team]+count)*ratio);
                }
                else {
                    toterritory.meta.count[team] += count;
                }
    
                if(toterritory.meta.count[teamto] < 0)
                    toterritory.meta.count[teamto] = 0;
    
                if(toterritory.meta.count[team] < 0)
                    toterritory.meta.count[team] = 0;
            } else {
                if(Object.keys(toterritory.meta.count).length == 1)
                toterritory.meta.count[team] = count;
            }
        }
    }
    
    return {before : before.meta, after : toterritory.meta};
}

function getStakeHolderImpactRatio(carnival, teamfrom, teamto){
    var eval1 = carnival.game.teams[teamfrom].stakeholders[teamto];
    var eval2 = carnival.game.teams[teamto].stakeholders[teamfrom];

    var finaltype;
    if(eval1.type === "participative" && eval2.type === "participative" )
        finaltype = "participative";

    if(eval1.type === "participative" && eval2.type === "discursive" )
        finaltype = "discursive";

    if(eval1.type === "participative" && eval2.type === "repressive" )
        finaltype = "repressive";

    if(eval1.type === "discursive" && eval2.type === "participative" )
        finaltype = "discursive";

    if(eval1.type === "discursive" && eval2.type === "discursive" )
        finaltype = "discursive";

    if(eval1.type === "discursive" && eval2.type === "repressive" )
        finaltype = "repressive";

    if(eval1.type === "repressive" && eval2.type === "participative" )
        finaltype = "repressive";

    if(eval1.type === "repressive" && eval2.type === "discursive" )
        finaltype = "repressive";

    if(eval1.type === "repressive" && eval2.type === "repressive" )
        finaltype = "repressive";

    switch(finaltype){
        case "participative" : return 1.2;
        case "discursive" : return 1;
        case "repressive" : return 0.8;
    }
}

module.exports.move = move;
module.exports.getObjectiveCost = getObjectiveCost;
module.exports.getAllObjectivesCost = getAllObjectivesCost;
module.exports.deleteObjective = deleteObjective;