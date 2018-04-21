var _ = require('lodash');
var fs = require('fs');

var session;
var basefolder = 'game';

function reset(carnival){
    return JSON.parse(fs.readFileSync('carnival.json', 'utf8'));
}

function newSession(){
    session = new Date().getTime();
}

function save(carnival){
    var folder = basefolder + '/' + session
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }

    var filename = folder + '/' + new Date().getTime() + '.json';
    fs.writeFile(filename,JSON.stringify(carnival, null, 2), function(err){
        if(err){
            console.error('error writing to ' + filename);
        }
    });
}

function resume(session, snapshot){
    var folder = basefolder + '/' + session + '/' + snapshot + '.json'; 
    if(!fs.existsSync(folder)){
        return null;
    } else {
        return {'snapshot' : snapshot, 'carnival' : JSON.parse(fs.readFileSync(folder, 'utf8'))};
    }
}

function listSnapshots(){
    var folder = basefolder + '/' + session;
    
    if(!fs.existsSync(folder)){
        return null;
    } else {
        return fs.readdirSync(folder);
    }
}

function getSessionName(){
    return session;
}

module.exports.reset = reset;
module.exports.newSession = newSession;
module.exports.save = save;
module.exports.resume = resume;
module.exports.listSnapshots = listSnapshots;
module.exports.getSessionName = getSessionName;
