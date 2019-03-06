import { combineReducers } from 'redux';
import { collection, storage } from '@shoutem/redux-io';
import { CONTACTS } from '../const';

const addressBookInitialState = {
  isInitialized: false,
  inProgress: false,
  inError: false,
  contacts: [],
  timestamp: null,
};

function addressBookContacts(state = addressBookInitialState, action) {
  switch (action.type) {
    case ADDRESS_BOOK_PROGRESS:
      return {
        ...state,
        inProgress: true,
      };
    case ADDRESS_BOOK_SUCCESS:
      return {
        isInitialized: true,
        inProgress: false,
        inError: false,
        contacts: action.payload,
        timestamp: new Date().getTime(),
      };
    case ADDRESS_BOOK_ERROR:
      return {
        ...state,
        inProgress: false,
        inError: true,
      };
    default:
      return state;
  }
}

export default combineReducers({
  addressBookContacts,
  contacts: combineReducers({
    all: collection(CONTACTS, 'all'),
    storage: storage(CONTACTS),
  }),
});
