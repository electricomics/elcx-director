var extend = require('extend');

function Step () {
  // this function, for now, is no-op that just creates
  // a nice 'Step' object that can be returned by getSteps
}

function getSteps () {
  // we need to convert NodeList into an array so we can
  // iterate over it
  var nodes = [].slice.call(document.querySelectorAll('.step'));

  if (nodes.length === 0) {
    throw new Error('There needs to be at least one element in the document with a class name of ".step"');
  }

  return nodes.map(function (el) {
    var step = new Step();

    extend(step, el.dataset);

    step.images = [].slice.call(el.children);
    step.node = el;
    step.id = el.id;

    return step;
  });
}

function generateStep (step) {
  var el = document.createElement('section');

  // @TODO: add checks for correct properties
  el.className = 'step';
  el.id = step.id || '';

  Object.keys(step).forEach(function (attr) {
    if (attr !== 'id') {
      el.dataset[attr] = step[attr];
    }
  });

  document.body.appendChild(el);
}

/*
 * Return the index of a step given it's id
 */

function findIndexById (id) {
  // @TODO: Cleaner once Safari 8 arrives and has support for
  // Array.prototype.findindex()

  var result = null;

  this.steps.some(function (el, i) {
    if (el.id === id) {
      result = i;
      return true;
    }
  });

  return result;
};

module.exports = {
  get: getSteps,
  generate: generateStep,
  findIndexById: findIndexById
};