"use strict";

var React   = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var {Link}  = require('react-router');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="col-8 centered">
        <h1>Whoops &ndash; Page not found :(</h1>
        <p>Maybe the URL you typed in was wrong, or maybe we moved something around.<br/>
        In any case, what you were looking for isn't here! Sorry!</p>
        <p>Go back to <Link to="/">Home</Link></p>
        <p>If you want to contact us about this issue, you can reach us here:</p>
        <p>
          Email: <a href="mailto:support@giantswarm.io">support@giantswarm.io</a><br/>
          Twitter: <a href="https://www.twitter.com/giantswarm" target="_blank">@giantswarm</a>
        </p>

      </div>
    );
  }
});