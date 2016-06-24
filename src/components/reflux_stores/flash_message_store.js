"use strict";
var Reflux = require('reflux');
var flashMessageActions = require("../reflux_actions/flash_message_actions");
var _ = require('underscore');

var flashMessages = new Set();

// {
//   icon: "warning-triangle",
//   message: "You are already logged in",
//   class: "warning"
// }
var id = 0;
function flashId() {
  return id ++;
}

module.exports = Reflux.createStore({
  listenables: flashMessageActions,

  getInitialState: function() {
    return flashMessages;
  },

  onAdd: function(flashMessage) {
    // Add a random unique key to the flash message so that react can keep
    // track of it correctly in the iterator.
    flashMessage.key = "flash-" + flashId();
    flashMessages.add(flashMessage);
    this.trigger(flashMessages);
  },

  onRemove: function(flashMessage) {
    flashMessages.delete(flashMessage);
    this.trigger(flashMessages);
  },

  onClearAll: function() {
    flashMessages = new Set();
    this.trigger(flashMessages);
  },

  getAll: function() {
    return Array.from(flashMessages);
  }

});