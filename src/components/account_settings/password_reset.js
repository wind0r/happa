'use strict';

import React from 'react';
import Button from '../button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GiantSwarm from '../../lib/giantswarm_client_wrapper';

var PasswordReset = React.createClass({
  getInitialState: function() {
    return ({
      formValid: false
    });
  },

  currentPasswordValid: function() {
    return this.refs.current_password.value;
  },

  newPasswordValid: function() {
    return this.refs.new_password.value;
  },

  newPasswordConfirmationValid: function() {
    return this.refs.new_password.value && (this.refs.new_password.value === this.refs.new_password_confirmation.value);
  },

  validate: function() {
    if (this.refs.current_password.value) {
      this.setState({
        buttonVisible: true,
        error: false
      });
    } else {
      this.setState({
        buttonVisible: false,
        error: false
      });
    }

    if (
      this.currentPasswordValid() &&
      this.newPasswordValid() &&
      this.newPasswordConfirmationValid()
    ) {
      this.setState({
        formValid: true,
        success: false,
        error: false
      });
    } else {
      this.setState({
        formValid: false,
        success: false,
        error: false
      });
    }
  },

  submit: function(e) {
    e.preventDefault();

    this.setState({
      submitting: true,
      error: false
    });

    var authToken = this.props.user.authToken;
    var giantSwarm = new GiantSwarm.Client(authToken);

    giantSwarm.changePassword({
      old_password: this.refs.current_password.value,
      new_password: this.refs.new_password.value
    })
    .then(() => {
      this.setState({
        success: true,
        submitting: false,
        error: false,
        buttonVisible: false
      });

      this.props.afterChange();
    })
    .catch((error) => {
      var errorMessage;

      if (error.body && error.body.status_code && error.body.status_code === 10010) {
        errorMessage = <span>Your current password doesn't seem to be right.</span>;
      } else {
        errorMessage = <span>Something went wrong while trying to set your password.
          Perhaps our servers are down. Could you try again later,
          or contact support otherwise:
          &nbsp;
          <a href='mailto:support@giantswarm.io'>support@giantswarm.io</a>
        </span>;
      }

      this.setState({
        error: true,
        submitting: false,
        buttonVisible: false,
        errorMessage: errorMessage
      });
    });
  },

  render: function() {
    return (
      <div className='row section'>
        <div className='col-3'>
          <h3 className='table-label'>Password</h3>
        </div>
        <div className='col-9'>
          <p>
            Use this form to change your password.
          </p>

          <small>
            <i className='fa fa-info-circle'></i>&nbsp;
            After setting your password you will be logged out and have to log in again with the new password.
          </small>

          <form onSubmit={this.submit} className="change_email_form" >
            <div className='textfield small'>
              <label>Current Password</label>
              <input onChange={this.validate} type='password' id='current_password' ref='current_password'/>
            </div>

            <div className='textfield small'>
              <label>New Password</label>
              <input onChange={this.validate} type='password' id='new_password' ref='new_password'/>
            </div>

            <div className='textfield small'>
              <label>New Password (once more)</label>
              <input onChange={this.validate} type='password' id='new_password_confirmation' ref='new_password_confirmation'/>
            </div>

            <div className="button-area">
              <ReactCSSTransitionGroup
                transitionName='slide-right'
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
                {
                  this.state.buttonVisible ?

                  <Button type='submit'
                          bsStyle='primary'
                          disabled={!this.state.formValid}
                          loading={this.state.submitting}
                          loadingMessage="Saving...">
                    Set New Password
                  </Button>

                  : null
                }
              </ReactCSSTransitionGroup>

              <ReactCSSTransitionGroup
                transitionName='slide-right'
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
                {
                  this.state.success
                  ?
                    <div className='form-success'><i className='fa fa-check-circle' />Password Set Succesfully</div>
                  :
                    null
                }
              </ReactCSSTransitionGroup>


              <ReactCSSTransitionGroup
                transitionName='slide-right'
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
              {
                this.state.error
                ?
                  <div className='flash-messages--flash-message flash-messages--danger'>
                    {this.state.errorMessage}
                  </div>
                :
                  null
              }
              </ReactCSSTransitionGroup>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = PasswordReset;
