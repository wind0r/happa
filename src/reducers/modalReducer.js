"use strict";

import * as types from '../actions/actionTypes';

export default function modalReducer(state = {visible: false}, action = undefined) {
  switch(action.type) {
    case types.MODAL_HIDE:
      return Object.assign({}, state, {
        visible: false
      });


    case types.ORGANIZATION_DELETE:
      return {
        visible: true,
        templateValues: {orgId: action.orgId},
        template: 'organizationDelete'
      };

    case types.ORGANIZATION_CREATE:
      return {
        visible: true,
        templateValues: {
          loading: false
        },
        template: 'organizationCreate'
      };

    case types.ORGANIZATION_CREATE_CONFIRM:
      return {
        visible: true,
        templateValues: {
          loading: true
        },
        template: 'organizationCreate'
      };

    case types.ORGANIZATION_ADD_MEMBER:
      return {
        visible: true,
        templateValues: {orgId: action.orgId},
        template: 'organizationAddMember'
      };

    case types.ORGANIZATION_REMOVE_MEMBER:
      return {
        visible: true,
        templateValues: {orgId: action.orgId, username: action.username},
        template: 'organizationRemoveMember'
      };

    default:
      return state;
  }
}