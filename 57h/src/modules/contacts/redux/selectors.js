import _ from 'lodash';
import { createSelector } from 'reselect';
import { getCollection, getOne, cloneStatus } from '@shoutem/redux-io';
import { CONTACTS } from '../const';
import { Contacts } from '../services';

export function getContactsState(state) {
  return state.contacts;
}

export function getContacts(state) {
  const contactsState = getContactsState(state);
  const all = _.get(contactsState, 'contacts.all');
  return getCollection(all, state);
}

export function getContact(state, contactId) {
  return getOne(contactId, state, CONTACTS);
}

export const getAllContacts = createSelector(
  state => isContactsStateInitialized(state),
  state => getContacts(state),
  state => matchContactsWithAddressBook(state),
  (contactsInitialized, contacts, addressBookContacts) => {
    if (!contactsInitialized) {
      return null;
    }

    const allContacts = Contacts.sortByName([
      ...addressBookContacts,
      ...contacts,
    ]);

    cloneStatus(contacts, allContacts);
    return allContacts;
  }
);
