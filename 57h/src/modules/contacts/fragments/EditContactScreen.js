import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { AppColors } from '~/theme';
import { HeaderCloseButton, getParams } from '~/modules/navigation';
import { DiscardChangesActionSheet } from '~/components/general';
import { handleApiError } from '~/modules/errors';
import { calculateDifferenceObject } from '~/modules/core';
import { showNotification } from '~/modules/notifications';
import { ContactForm } from '../components';
import { getContactInfo, getContact, updateContact } from '../redux';
import { mapEditContactViewToModel } from '../services/contacts';

function getFields(contact) {
  const client = _.get(contact, 'client', null);
  const disabledFields = _.keys(client);

  return {
    firstName: {
      required: true,
      autoFocus: true,
      autoCorrect: false,
      disabled: _.includes(disabledFields, 'firstName'),
    },
    lastName: {
      required: true,
      autoCorrect: false,
      disabled: _.includes(disabledFields, 'lastName'),
    },
    phone: {
      required: true,
      keyboardType: 'numeric',
      disabled: _.includes(disabledFields, 'phone'),
    },
    email: {
      required: true,
      autoCorrect: false,
      autoCapitalize: false,
      keyboardType: 'email-address',
      disabled: _.includes(disabledFields, 'email'),
    },
    photoUrl: {
      disabled: _.includes(disabledFields, 'photoUrl'),
    },
    emergencyContactName: {
      autoCorrect: false,
    },
    emergencyNumber: {
      keyboardType: 'numeric',
    },
    notes: {
      autoCorrect: false,
    },
  };
}

class EditContactScreen extends Component {
  static handleCloseButtonPress(navigation) {
    const hasChanges = _.get(navigation, 'state.params.hasChanges', false);

    if (hasChanges) {
      navigation.setParams({
        actionSheetActive: true,
      });
    }

    navigation.goBack(null);
  }

  static navigationOptions({ navigation }) {
    return {
      headerLeft: (
        <HeaderCloseButton
          navigation={navigation}
          onPress={EditContactScreen.handleCloseButtonPress}
        />
      ),
    };
  }

  constructor(props) {
    super(props);

    const { contact, contactInfo } = props;

    // NOTE: no need for mapModelToView, getContactInfo does it for us
    const resolvedFields = getFields(contact);

    this.state = {
      values: contactInfo,
      fields: resolvedFields,
    };
  }

  @autobind
  handleUpdateContactPress(newValues) {
    const { navigation, contact } = this.props;
    const { values } = this.state;

    const updates = calculateDifferenceObject(newValues, values);
    const updateValues = mapEditContactViewToModel(updates);

    return this.props
      .updateContact(contact.id, updateValues)
      .then(() => {
        navigation.goBack();
        this.props.showNotification({
          message: 'Client successfully updated!',
        });
      })
      .catch(handleApiError);
  }

  @autobind
  handleValuesChange(newValues, nextHasChanges) {
    const { navigation } = this.props;

    const hasChanges = _.get(navigation, 'state.params.hasChanges', false);

    if (nextHasChanges !== hasChanges) {
      this.updateNavigationParams({ hasChanges: nextHasChanges });
    }
  }

  @autobind
  handleActionSheetConfirm() {
    this.props.navigation.goBack(null);
  }

  @autobind
  handleActionSheetDecline() {
    this.updateNavigationParams({ actionSheetActive: false });
  }

  @autobind
  updateNavigationParams(params) {
    const { navigation } = this.props;

    navigation.setParams(params);
  }

  render() {
    const { navigation } = this.props;
    const { values, fields } = this.state;

    const actionSheetActive = _.get(
      navigation,
      'state.params.actionSheetActive',
      false
    );

    return (
      <View style={styles.container}>
        <ContactForm
          fields={fields}
          values={values}
          title="Edit profile"
          buttonTitle="UPDATE CLIENT"
          onChange={this.handleValuesChange}
          onSubmit={this.handleUpdateContactPress}
        />
        <DiscardChangesActionSheet
          isVisible={actionSheetActive}
          onCancel={this.handleActionSheetDecline}
          onConfirm={this.handleActionSheetConfirm}
        />
      </View>
    );
  }
}

EditContactScreen.propTypes = {
  navigation: PropTypes.object,
  contactInfo: PropTypes.object,
  contact: PropTypes.object,
  showNotification: PropTypes.func,
  updateContact: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});

function mapStateToProps(state, ownProps) {
  const params = getParams(ownProps.navigation);
  const { contactId } = params;
  const contact = getContact(state, contactId);
  const contactInfo = getContactInfo(state, contactId);

  return {
    contact,
    contactInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateContact,
      showNotification,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContactScreen);
