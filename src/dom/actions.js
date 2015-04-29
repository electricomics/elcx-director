function trigger (step) {
  var actions = step.images.map(function (img) {
    return img.dataset.action;
  });

  actions.forEach(function (action, i) {
    if (action) {
      this.emit('action::' + action, step.images[i]);
    }
  }, this);
}

module.exports = {
  trigger: trigger
};