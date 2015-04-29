(function() {


function Director (options) {
  var opts = options || {};

  return this;
}


if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = Director;
}
else {
  this.Director = Director;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());