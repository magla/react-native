import _ from 'lodash';
import {
  validateRequiredFields,
  validatePhoneNumberFormat,
  validateEmailFormat,
} from '~/modules/core';

/**
 * Merge contact and client data into one data source (for one contact)
 * Client data overrides initial contact data, if present
 *
 * Returns a contactInfo object:
 * {
 *  id,
 *  firstName,
 *  lastName,
 *  photoUrl,
 *  emergencyContactName,
 *  emergencyNumber,
 *  notes,
 *  phone,
 *  email
 * }
 */
export function mapModelToView(contact) {
  if (_.isEmpty(contact)) {
    return null;
  }

  const client = _.get(contact, 'client', null);
  const { phoneNumbers, emails, ...contactValues } = contact;

  const phone = _.head(phoneNumbers);
  const email = _.head(emails);

  if (!client) {
    return { ...contactValues, phone, email };
  }

  const clientValues = _.pick(client, [
    'fullName',
    'firstName',
    'lastName',
    'photoUrl',
  ]);

  const clientPhone = _.get(client, 'phone');
  const clientEmail = _.get(client, 'email');

  return {
    ...contactValues,
    ...clientValues,
    phone: clientPhone || phone,
    email: clientEmail || email,
    isRegistered: true,
  };
}

/**
 * It's required to input either phone or email
 */
export function validateContactRequiredFields(values, requiredFields) {
  const { phone, email } = values;

  const errors = validateRequiredFields(values, requiredFields);

  if (phone || email) {
    return errors;
  }

  return {
    ...errors,
    phone: true,
    email: true,
  };
}

export function validateContactProfile(values, requiredFields) {
  const { phone, email } = values;

  const errors = validateRequiredFields(values, requiredFields);

  const emailError = email && validateEmailFormat(email);
  const phoneError = phone && validatePhoneNumberFormat(phone);

  return {
    ...errors,
    ...emailError,
    ...phoneError,
  };
}
