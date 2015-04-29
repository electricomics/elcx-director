var inherits = require('inherits');

function PageEvent (stepTo, stepFrom) {
  // this is the default event type
  this.type = 'action';

  if (stepTo && stepFrom) {
    this.type = 'transition';
    this.to = stepTo;
    this.from = stepFrom;
  }
  else if (stepTo) {
    this.type = 'start';
    this.from = stepTo;
  }
}

module.exports = PageEvent;
