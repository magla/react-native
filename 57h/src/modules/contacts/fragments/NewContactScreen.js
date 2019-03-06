import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AppColors } from '~/theme';
import {
  HeaderCloseButton,
  getParams,
  reset,
  navigate,
  popSubtree,
} from '~/modules/navigation';
import { autobind } from 'core-decorators';
import { DiscardChangesActionSheet } from '~/components/general';
import { handleApiError } from '~/modules/errors';
import { showNotification } from '~/modules/notifications';
import { ContactForm } from '../components';
import { createContact } from '../redux';
import { mapViewToModel } from '../services/contacts';

const fields = {
  firstName: {
    required: true,
    autoCorrect: false,
    autoFocus: true,
  },
  lastName: {
    required: true,
    autoCorrect: false,
  },
  phone: {
    required: true,
    keyboardType: 'numeric',
  },
  email: {
    required: true,
    autoCorrect: false,
    autoCapitalize: false,
    keyboardType: 'email-address',
  },
  photoUrl: {
    hidden: true,
  },
  emergencyContactName: {
    hidden: true,
    autoCorrect: false,
  },
  emergencyNumber: {
    hidden: true,
    keyboardType: 'numeric',
  },
  notes: {
    hidden: true,
    autoCorrect: false,
  },
};

class NewContactScreen extends Component {
  static handleCloseButtonPress(navigation) {
    const hasChanges = _.get(navigation, 'state.params.hasChanges', false);

    if (hasChanges) {
      navigation.setParams({
        actionSheetActive: true,
      });
      return;
    }

    navigation.goBack(null);
  }

  static navigationOptions({ navigation }) {
    return {
      headerLeft: (
        <HeaderCloseButton
          navigation={navigation}
          onPress={NewContactScreen.handleCloseButtonPress}
        />
      ),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      values: {},
    };
  }

  @autobind
  handleCreateContactPress(values) {
    const contactValues = mapViewToModel(values);

    return this.props
      .createContact(contactValues)
      .then(() => {
        this.props.showNotification({
          message: 'Client successfully created!',
        });

        this.props.navigateToClients();
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
    const { values } = this.state;

    const params = getParams(navigation);
    const actionSheetActive = _.get(params, 'actionSheetActive', false);

    return (
      <View style={styles.container}>
        <ContactForm
          fields={fields}
          values={values}
          title="New client"
          buttonTitle="ADD TO MY CLIENTS"
          onChange={this.handleValuesChange}
          onSubmit={this.handleCreateContactPress}
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

NewContactScreen.propTypes = {
  navigation: PropTypes.object,
  navigateBack: PropTypes.func,
  navigateToClients: PropTypes.func,
  createContact: PropTypes.func,
  showNotification: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createContact: contact => createContact(contact, 'manual'),
      navigateBack: () => popSubtree({ debounce: false }),
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
  null,
  mapDispatchToProps
)(NewContactScreen);
