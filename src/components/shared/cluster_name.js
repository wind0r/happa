'use strict';

import { clusterPatch } from '../../actions/clusterActions';
import { FlashMessage, messageTTL, messageType } from '../../lib/flash_message';
import Button from '../shared/button';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from 'react-bootstrap/lib/Tooltip';

/**
 * ClusterName is a widget to display and edit a cluster name in the same
 * place. It renders as inline-block.
 */
class ClusterName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // editing is true while the widget is in edit mode.
      editing: false,
      // name is a copy of the actual cluster name
      name: props.name,
      // inputFieldValue is what the input field currently holds
      inputFieldValue: props.name,
    };
  }

  activateEditMode = () => {
    this.setState({
      editing: true,
      inputFieldValue: this.state.name,
    });
  };

  deactivateEditMode = () => {
    this.setState({
      editing: false,
      // revert input
      inputFieldValue: this.state.name,
    });
  };

  handleChange = evt => {
    this.setState({ inputFieldValue: evt.target.value });
  };

  handleSubmit = evt => {
    evt.preventDefault();

    var validate = this.validate();
    if (typeof validate === 'object') {
      new FlashMessage(
        'Error: ' + validate.error,
        messageType.ERROR,
        messageTTL.MEDIUM
      );
      return;
    }

    this.props
      .dispatchFunc(
        clusterPatch({
          id: this.props.id,
          name: this.state.inputFieldValue,
        })
      )
      .then(() => {
        this.setState({
          editing: false,
          name: this.state.inputFieldValue,
        });

        new FlashMessage(
          'Cluster name changed',
          messageType.SUCCESS,
          messageTTL.SHORT
        );
      });
  };

  handleKey = evt => {
    // 27 = Escape key
    if (evt.keyCode === 27) {
      this.deactivateEditMode();
    }
  };

  validate = () => {
    if (this.state.name.length < 3) {
      return {
        valid: false,
        error: 'Please use a name with at least 3 characters',
      };
    }

    return true;
  };

  render = () => {
    if (this.state.editing) {
      // edit mode
      return (
        <form className='form cluster-name' onSubmit={this.handleSubmit}>
          <input
            type='text'
            name='cluster-name'
            value={this.state.inputFieldValue}
            autoFocus
            onChange={this.handleChange}
            onKeyUp={this.handleKey}
            autoComplete='off'
          />
          <div className='btn-group'>
            <Button type='submit'>OK</Button>
            <Button onClick={this.deactivateEditMode}>Cancel</Button>
          </div>
        </form>
      );
    }

    // view mode
    return (
      <OverlayTrigger
        placement='top'
        overlay={<Tooltip id='tooltip'>Click to edit cluster name</Tooltip>}
      >
        <a className='cluster-name' onClick={this.activateEditMode}>
          {this.state.name}
        </a>
      </OverlayTrigger>
    );
  };
}

ClusterName.propTypes = {
  dispatchFunc: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default ClusterName;
