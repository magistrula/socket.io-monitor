var _ = require('lodash');
_.mixin(require('lodash-deep'));

var MessageCounter = function(){
  this.data = {
    inbound: {},
    outbound: {}
  }
}

MessageCounter.prototype._increment = function(){
  var objectPath = _.toArray(arguments).join('.');
  var count = _.deepGet(this.data, objectPath) || 0;
  _.deepSet(this.data, objectPath, ++count);
};

MessageCounter.prototype.incrementInbound = function(type, eventName){
  this._increment.apply(this, ['inbound'].concat(_.toArray(arguments)));
}

MessageCounter.prototype.incrementOutbound = function(type, eventName){
  this._increment.apply(this, ['outbound'].concat(_.toArray(arguments)));
}

module.exports = MessageCounter;