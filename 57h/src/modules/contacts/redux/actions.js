import rio, { find, create, update, remove } from '@shoutem/redux-io';
import uuid from 'uuid/v4';
import _ from 'lodash';
import AppConfig from '~/config';
import { getActiveUserId } from '~/modules/users';
import { uploadImage } from '~/modules/assets';

const CONTACTS_FOLDER = 'contacts';
const CONTACTS_ENDPOINT = `${
  AppConfig.baseUrl
}/guides/{guideId}/contacts/{contactId}`;

rio.registerResource({
  schema: CONTACTS,
  request: {
    endpoint: CONTACTS_ENDPOINT,
    headers: {
      Accept: 'application/vnd.api+json',
    },
  },
  actions: {
    create: {
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      },
    },
    update: {
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      },
    },
  },
});

function uploadContactImage(contact, guideId) {
  const { photoUrl } = contact;
  if (!photoUrl) {
    return Promise.resolve();
  }

  const fileNameId = uuid();
  const fileName = `${CONTACTS_FOLDER}/${fileNameId}`;

  const userContext = { id: guideId, type: 'guides' };
  return uploadImage(userContext, photoUrl, fileName);
}

export function loadContacts() {
  return (dispatch, getState) => {
    const state = getState();
    const guideId = getActiveUserId(state);
    if (!guideId) {
      return Promise.reject();
    }

    return dispatch(find(CONTACTS, 'all', { guideId }));
  };
}

export function createContact(contact, source = 'address-book') {
  return (dispatch, getState) => {
    const state = getState();
    const guideId = getActiveUserId(state);

    if (!guideId) {
      return Promise.reject();
    }

    const newContact = {
      type: CONTACTS,
      source,
      ...contact,
    };

    if (contact.photoUrl) {
      return uploadContactImage(newContact, guideId).then(url =>
        dispatch(
          create(CONTACTS, { ...newContact, photoUrl: url }, { guideId })
        ).then(response => {
          const data = _.get(response, 'payload.data', {});
          return { id: data.id, ...data.attributes };
        })
      );
    }

    return dispatch(create(CONTACTS, newContact, { guideId })).then(
      response => {
        const data = _.get(response, 'payload.data', {});
        return { id: data.id, ...data.attributes };
      }
    );
  };
}

export function updateContact(contactId, updatePatch) {
  return (dispatch, getState) => {
    const state = getState();
    const guideId = getActiveUserId(state);

    if (!guideId) {
      return Promise.reject();
    }

    const contactPatch = {
      id: contactId,
      type: CONTACTS,
      ...updatePatch,
    };

    if (updatePatch.photoUrl) {
      return uploadContactImage(updatePatch, guideId).then(photoUrl =>
        dispatch(
          update(
            CONTACTS,
            { ...contactPatch, photoUrl },
            { guideId, contactId }
          )
        ).then(response => {
          const data = _.get(response, 'payload.data', {});
          return { id: data.id, ...data.attributes };
        })
      );
    }

    return dispatch(
      update(CONTACTS, contactPatch, { guideId, contactId })
    ).then(response => {
      const data = _.get(response, 'payload.data', {});
      return { id: data.id, ...data.attributes };
    });
  };
}

export function deleteContact(contactId) {
  return (dispatch, getState) => {
    const state = getState();
    const guideId = getActiveUserId(state);

    if (!guideId) {
      return Promise.reject();
    }

    const params = {
      guideId,
      contactId,
    };

    return dispatch(
      remove(CONTACTS, { id: contactId, type: CONTACTS }, params)
    );
  };
}
