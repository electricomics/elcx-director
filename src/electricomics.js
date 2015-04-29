/*!
 * Electricomics
 * https://github.com/ocastastudios/electricomics
 *
 * Copyright (c) 2014 Ocasta Studios
 * Licensed under the ??? license.
 */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var inherits = require('inherits');

var steps = require('./dom/steps');
var actions = require('./dom/actions');
var history = require('./dom/history');

var PageEvent = require('./events/page');

/*
 * Constructor for the Electricomics object initialises
 * the page but does nothing
 *
 * There is no current step set as the page is only initialised
 * and not yet being played.
 */

function Electricomics (options) {
  options = options || {};

  // initialise emitter via superconstructor with options
  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: '::'
  });

  // a 'step' in an incremental point where a new action should
  // occur within the context of a page
  Object.defineProperty(this, 'steps', {
    get: steps.get
  });

  // bind event listener to handle steps when using
  // the browser back button
  window.addEventListener('popstate', function (e) {
    if (e.state) {
      this.step(e.state.id);
    }
  }.bind(this));

  return this;
}

inherits(Electricomics, EventEmitter2);

Electricomics.prototype.addSteps = function (toCreate) {
  if (Array.isArray(toCreate)) {
    // @TODO: would be nice to write this as a
    // DocumentFragment in future
    toCreate.forEach(steps.generate);
  }
  else if (toCreate instanceof Object) {
    steps.generate(toCreate);
  }
  else {
    throw new Error('Invalid data for a new step.');
  }

  return steps.get();
};

/*
 * Start the electricomic page at the supplied step
 * If no step is provided start at the first step (step 0)
 */

Electricomics.prototype.start = function (step) {
  var firstStep = step ? step : 0;

  if (location.hash.length !== 0) {
    firstStep = location.hash.split('/')[2];
  }

  // @TODO: is there a better way to express this? Doing
  // if (!this.position) causes false positives with 0
  if (typeof this.position !== 'undefined') {
    throw new Error('No need to play, page already started.');
  }

  step = this.step(firstStep);

  history.start(step);

  return step;
};

/*
 * Change the current position and
 */

Electricomics.prototype.step = function (step) {
  var currentStep;

  // check to make sure we have a step already
  if (typeof this.position !== 'undefined') {
    currentStep = this.steps[this.position];
  }

  if (typeof step === 'string') {
    var newPosition = steps.findIndexById.apply(this, arguments);

    if (newPosition === this.position) {
      throw new Error('Already at this position.');
    }
    else if (typeof newPosition !== 'undefined') {
      this.position = newPosition;
    }
    else {
      throw new Error('You must provide a valid step ID.');
    }
  }
  else {
    if (step === this.position) {
      throw new Error('Already at this position.');
    }
    else if (step >= 0 && step < this.steps.length) {
      this.position = step;
    }
    else {
      throw new Error('No step exists at the supplied position.');
    }
  }

  var nextStep = this.steps[this.position];
  actions.trigger.call(this, nextStep);

  this.emit(
    'page::step-change',
    new PageEvent(nextStep, currentStep)
  );

  return nextStep;
};

/*
 * Get the current step object, or a step with a specific ID
 * or position if supplied as an argument
 */

Electricomics.prototype.getStep = function (position) {
  // @TODO: should this take variadic args to retrieve
  // an array of steps?
  if (arguments.length === 0) {
    return this.steps[this.position];
  }
  else if (typeof position === 'string') {
    var i = steps.findIndexById.apply(this, arguments);
    return this.steps[i];
  }
  else {
    return this.steps[position];
  }
};

/*
 * Navigate to a particular step and add it to history
 */

Electricomics.prototype.goToStep = function (identifier) {
  var step = this.step(identifier);

  // just add this step to history
  history.add(step);

  return step;
};

/*
 * Navigate to the next step as defined by the data-next property
 * If there is no data-next then go to the next in the steps array
 */

Electricomics.prototype.nextStep = function () {
  var step;

  if (typeof this.position === 'undefined') {
    throw new Error('Can\'t call nextStep() before start()');
  }

  if (this.steps[this.position].next) {
    step = this.goToStep(this.steps[this.position].next);
  }
  else if ((this.position + 1) < this.steps.length) {
    step = this.goToStep(this.position + 1);
  }
  else {
    throw new Error('No more steps in this sequence.');
  }

  return step;
};

/*
 * Navigate to the previous step as defined by the data-prev property
 * If there is no data-prev then go to the previous in the steps array
 */

Electricomics.prototype.prevStep = function () {
  var step;

  if (typeof this.position === 'undefined') {
    throw new Error('Can\'t call prevStep() before start()');
  }

  if (this.steps[this.position].previous) {
    step = this.goToStep(this.steps[this.position].previous);
  }
  else if ((this.position - 1) >= 0) {
    step = this.goToStep(this.position - 1);
  }
  else {
    throw new Error('No more steps in this sequence.');
  }

  return step;
};

/*
 * Navigate to the back step in history
 * Need to check if the step is the first as we don't want to exit the story
 * @param {function} callback - Function to call when the history changes
 */

Electricomics.prototype.back = function (callback) {
  if (typeof this.position === 'undefined') {
    throw new Error('Can\'t call back() before start()');
  }
  else if (this.position === 0) {
    throw new Error('No more steps in this sequence.');
  }

  window.history.back();

  if (callback) {
    window.addEventListener('popstate', callback);
  }
};

/*
 * Navigate to the forward step in history
 * No need to check if there is a forward step, as in that case the browser will just do nothing
 * @param {function} callback - Function to call when the history changes
 */

Electricomics.prototype.forward = function (callback) {
  if (typeof this.position === 'undefined') {
    throw new Error('Can\'t call forward() before start()');
  }

  window.history.forward();

  if (callback) {
    window.addEventListener('popstate', callback);
  }
};

if (typeof exports === 'object') {
  // CommonJS
  module.exports = Electricomics;
}

window.Electricomics = Electricomics;
