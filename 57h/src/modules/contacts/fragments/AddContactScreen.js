import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { AppColors } from '~/theme';
import {
  HeaderCloseButton,
  getParams,
  reset,
  navigate,
  goBack,
} from '~/modules/navigation';
import { calculateDifferenceObject } from '~/modules/core';
import { handleApiError } from '~/modules/errors';
import { showNotification } from '~/modules/notifications';
import { AddContactForm } from '../components';
import { createContact, updateContact } from '../redux';
import {
  mapViewToModel,
  mapModelToView,
  mapEditContactViewToModel,
} from '../services/contacts';

const fields = {
  firstName: {
    required: true,
    autoCorrect: false,
  },
  lastName: {
    required: true,
    autoCorrect: false,
  },
  email: {
    autoCorrect: false,
    autoCapitalize: false,
    keyboardType: 'email-address',
  },
  phone: {
    keyboardType: 'phone-pad',
  },
};

class AddContactScreen extends Component {
  static handleCloseButtonPress(navigation) {
    navigation.goBack(null);
  }

  static navigationOptions({ navigation }) {
    return {
      headerLeft: (
        <HeaderCloseButton
          navigation={navigation}
          onPress={AddContactScreen.handleCloseButtonPress}
        />
      ),
    };
  }

  constructor(props) {
    super(props);

    const { contact } = props;

    const contactValues = mapModelToView(contact);

    this.state = {
      values: contactValues || {},
    };
  }

  @autobind
  addContactDone(contact) {
    const { navigation } = this.props;
    const { onContactAdd } = getParams(navigation);

    if (_.isFunction(onContactAdd)) {
      onContactAdd(contact);
    }

    return this.props.navigateBack();
  }

  @autobind
  handleAddContactPress(newValues) {
    const { values: initialValues } = this.state;

    const contactId = _.get(newValues, 'id', null);

    if (!contactId) {
      const contactValues = mapViewToModel(newValues);

      return this.props
        .createContact(contactValues)
        .then(createdContact => this.addContactDone(createdContact))
        .catch(handleApiError);
    }

    const updates = calculateDifferenceObject(newValues, initialValues);

    if (_.isEmpty(updates)) {
      const contactValues = mapViewToModel(initialValues);

      return this.addContactDone(contactValues);
    }

    const updateValues = mapEditContactViewToModel(updates);

    return this.props
      .updateContact(contactId, updateValues)
      .then(updatedContact => this.addContactDone(updatedContact))
      .catch(handleApiError);
  }

  @autobind
  handleOnAddContactPress() {
    this.props.navigateToContactsSelector({
      params: { onContactPress: this.handleContactAdd },
    });
  }

  @autobind
  handleContactAdd(contact) {
    const contactValues = mapModelToView(contact);

    this.setState({ values: contactValues });
  }

  render() {
    const { values } = this.state;

    return (
      <View style={styles.container}>
        <AddContactForm
          fields={fields}
          values={values}
          title="Add client"
          buttonTitle="ADD"
          onAddContactPress={this.handleOnAddContactPress}
          onSubmit={this.handleAddContactPress}
        />
      </View>
    );
  }
}

AddContactScreen.propTypes = {
  contact: PropTypes.object,
  navigation: PropTypes.object,
  navigateBack: PropTypes.func,
  navigateToContactsSelector: PropTypes.func,
  updateContact: PropTypes.func,
  createContact: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});

function mapStateToProps(state, ownProps) {
  const params = getParams(ownProps.navigation);
  const contact = _.get(params, 'contact', {});

  return {
    contact,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateContact,
      createContact: contact => createContact(contact, 'manual'),
      navigateBack: () => goBack({ debounce: false }),
      navigateToContactsSelector: options =>
        navigate('Contacts.BookingPicker', options),
      navigateToClients: () =>
        reset('App', {
          childAction: navigate('Guides.MyClients'),
        }),
      showNotification,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddContactScreen);
