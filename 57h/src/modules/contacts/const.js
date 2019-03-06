import images from './assets';

export const CONTACTS = '57hours.contacts';

export const CONTACT_SOURCES = [
  {
    value: 'Contacts.New',
    label: 'Add client manually',
    image: images.manual,
  },
];

/**
 * TODO: Might need tweaking in the long run
 * The values are provisional, and based on just a few tests
 * with the search results
 */
export const CONTACT_SEARCH_OPTIONS = {
  keys: [
    { name: 'firstName', weight: 0.1 },
    { name: 'lastName', weight: 0.2 },
    { name: 'email', weight: 0.75 },
    { name: 'emails', weight: 0.75 },
    { name: 'phone', weight: 1 },
    { name: 'phoneNumbers', weight: 1 },
  ],
};
