var util = require('util');
var debugEnv = (process.env.NODE_DEBUG || "").replace(/\"/g,"").split(" ");


var utilOut = {
    log:    util.log,
    error:  util.error,
    debug:  util.debug
};


function DebugLogger(section, prefix, out){
    this._section = section;
    this._prefix = prefix || section;
    this._out = out || utilOut;
};

DebugLogger.prototype.prefix = function prefix(prefix){
    if (this._prefix == '')
        return new(this._section, prefix);
    else{
        return new DebugLogger(this._section, this._prefix + ':' + prefix, this._out);
    }
};

DebugLogger.prototype.out = function out(out){
    this._out = out;
};

DebugLogger.prototype.log   = function log(){
    var msg = createMessage.bind(this)(arguments);
    this._out.log(msg);
}

DebugLogger.prototype.error   = function error(){
    var msg = createMessage.bind(this)(arguments);
    this._out.error(msg);
}

DebugLogger.prototype.debug   = function debug(){
    var msg = createMessage.bind(this)(arguments);
    this._out.debug(msg);
};

function createMessage (args) {
    return this._prefix+" "+Array.prototype.slice.call(args).join(", ");
}

module.exports = function (section, prefix){
    var isActive = debugEnv.indexOf(section) != -1;
    if (isActive) {
        var logger= new DebugLogger(section);
        if (prefix)
            logger = logger.prefix(prefix);
        return logger;
    } else {
        var noop = {
            log: function(){},
            error: function(){},
            debug: function(){},
            prefix: function(){return noop},
            through: function (){}
        }
        return noop;
    }
};