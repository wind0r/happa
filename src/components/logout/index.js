"use strict";

import actions from '../../actions/user_actions';
import store from '../../stores/user_store';
import Reflux from 'reflux';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { flashAdd, flashClearAll } from '../../actions/flashMessageActions';
import { connect } from 'react-redux';

var Logout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  mixins: [Reflux.connect(store,'user'), Reflux.listenerMixin],

  componentDidMount: function() {
    this.listenTo(actions.logout.completed, this.onLogoutCompleted);
    actions.logout();
  },

  onLogoutCompleted: function() {
    this.props.dispatch(flashClearAll());
    this.props.dispatch(flashAdd({
      message: 'You have logged out.',
      class: "info",
      ttl: 3000
    }));
    this.context.router.push('/login');
  },

  //TODO: turn progressbutton into a component
  render: function() {
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="logout--mask--transition" transitionAppear={true} transitionAppearTimeout={400} transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <div className="logout--mask"></div>
        </ReactCSSTransitionGroup>
        <div className="logout--container">
          <img className="loader" src="/images/loader_oval_light.svg" />
        </div>
      </div>
    );
  }
});

function mapStateToProps(state, ownProps) {
  return {};
}

module.exports = connect(mapStateToProps)(Logout);