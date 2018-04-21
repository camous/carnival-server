var _ = require('lodash');

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

module.exports.getObjectiveCost = getObjectiveCost;
module.exports.getAllObjectivesCost = getAllObjectivesCost;
module.exports.deleteObjective = deleteObjective;