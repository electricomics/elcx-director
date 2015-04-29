/*
 * Constructor for the Electricomics object initialises
 * the page but does nothing
 *
 * There is no current step set as the page is only initialised
 * and not yet being played.
 */

module.exports = {
  add: function (obj) {
    var ref = { id: obj.id };

    history.pushState(ref, '', '/#/step/' + ref.id.toString());
  },
  start: function (obj) {
    var ref = { id: obj.id };

    history.replaceState(ref, '', '/#/step/' + ref.id.toString());
  }
}
