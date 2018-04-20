var Graph = require('node-dijkstra');
var _ = require('lodash');

/**
 * Load carnival territories & neighbors for djistra routes
 * @param {JSON} carnival
 */
function initializeCarnivalRoutes(carnival){
    const route = new Graph();
    var paths = {};
    var territories = _.cloneDeep(carnival.territories);
    for(var territory in territories){

        var neighbors = territories[territory];
        delete neighbors.meta;

        if(paths[territory] === undefined){
            paths[territory] = neighbors;
        } else {
            paths[territory] = _.merge(paths[territory], neighbors);
        }

        var references = _.pickBy(territories, territory);
        for(var id in references){
            var reference = references[id];
            if(paths[id] === undefined){
                paths[id] = {};
            }
            paths[id][territory] = reference[territory];
        }
    }

    for(var territory in paths){
        route.addNode(territory, paths[territory]);
    }
    return route;
}

module.exports.initializeCarnivalRoutes = initializeCarnivalRoutes;