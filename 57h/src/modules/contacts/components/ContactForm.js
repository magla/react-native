import React, { Component } from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  FormContainer,
  FormField,
  FormSection,
  FormTitle,
} from '~/components/form';
import { DetailsSection } from '~/components/general';
import { Button } from '~/components/ui';
import { TextItem } from '~/components/list';
import { handleApiError } from '~/modules/errors';
import { validateRequiredFields } from '~/modules/core';
import { validateContactProfile, formatName } from '../services/contacts';

const AVATAR_DIMENSIONS = 80;

export default class ContactForm extends Component {
  constructor(props) {
    super(props);

    const { values } = props;

    this.state = {
      values,
      errors: [],
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { values } = this.props;
    const { values: nextValues } = nextProps;

    if (!_.isEqual(values, nextValues)) {
      this.updateValues(nextValues, false);
    }
  }

  @autobind
  handleImageChange(uri) {
    this.updateValues({ photoUrl: uri }, true);
  }

  @autobind
  handleEmergencyCallPress() {
    const { emergencyNumber } = this.state.values;

    Linking.openURL(`tel:${emergencyNumber}`);
  }

  @autobind
  handleSubmitPress() {
    const { onSubmit, fields } = this.props;
    const { values } = this.state;

    const errors = validateContactProfile(values, fields);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
      return;
    }

    if (onSubmit) {
      this.setState({ inProgress: true });

      return onSubmit(values)
        .then(() => this.setState({ inProgress: false }))
        .catch(() => {
          this.setState({ inProgress: false });
          handleApiError();
        });
    }
  }

  @autobind
  updateFieldValue(fieldName) {
    return value => this.updateValues({ [fieldName]: value });
  }

  @autobind
  updateValues(updates, trackChanges = true) {
    const { values: initialValues, fields, onChange } = this.props;
    const { values, hasChanges } = this.state;

    const newValues = {
      ...values,
      ...updates,
    };

    const hasNewChanges = trackChanges
      ? !_.isEqual(initialValues, newValues)
      : hasChanges;

    if (onChange) {
      onChange(values, newValues, hasNewChanges);
    }

    const errors = validateRequiredFields(newValues, fields);

    this.setState({
      errors,
      hasChanges: hasNewChanges,
      values: newValues,
    });
  }

  @autobind
  renderNotes() {
    const { isPreview, fields } = this.props;
    const { notes } = this.state.values;

    if (_.get(fields, 'notes.hidden')) {
      return null;
    }

    if (isPreview) {
      return (
        <DetailsSection title="Notes">
          <TextItem>{notes || 'No notes yet.'}</TextItem>
        </DetailsSection>
      );
    }

    return (
      <DetailsSection title="add note">
        <FormField
          multiline
          value={notes}
          placeholder="Write a note for this client"
          onChange={this.updateFieldValue('notes')}
          {..._.get(fields, 'notes')}
        />
      </DetailsSection>
    );
  }

  @autobind
  renderDetails() {
    const { errors, values } = this.state;
    const { firstName, lastName, phone, email } = values;

    const { fields } = this.props;

    return (
      <FormSection>
        <FormField
          hasError={errors.firstName}
          label="First Name"
          value={firstName}
          onChange={this.updateFieldValue('firstName')}
          {..._.get(fields, 'firstName')}
        />
        <FormField
          hasError={errors.lastName}
          label="Last Name"
          value={lastName}
          onChange={this.updateFieldValue('lastName')}
          {..._.get(fields, 'lastName')}
        />
        <FormField
          hasError={errors.phone}
          error={errors.phone}
          label="Phone Number"
          value={phone}
          onChange={this.updateFieldValue('phone')}
          {..._.get(fields, 'phone')}
        />
        <FormField
          hasError={errors.email}
          error={errors.email}
          label="Email"
          value={email}
          onChange={this.updateFieldValue('email')}
          {..._.get(fields, 'email')}
        />
      </FormSection>
    );
  }

  @autobind
  renderEmergencyInfo() {
    const { emergencyContactName, emergencyNumber } = this.state.values;
    const { fields } = this.props;

    const hasEmergencyNumber = !_.isEmpty(emergencyNumber);

    return (
      <FormSection>
        <FormField
          autoCorrect={false}
          label="Emergency contact name (optional)"
          value={emergencyContactName}
          onChange={this.updateFieldValue('emergencyContactName')}
          {..._.get(fields, 'emergencyContactName')}
        />
        <FormField
          label="Emergency number (optional)"
          value={emergencyNumber}
          onChange={this.updateFieldValue('emergencyNumber')}
          onPress={hasEmergencyNumber && this.handleEmergencyCallPress}
          icon={hasEmergencyNumber && 'Call'}
          {..._.get(fields, 'emergencyNumber')}
        />
      </FormSection>
    );
  }

  @autobind
  renderTitle() {
    const { values } = this.state;
    const { title, isPreview, fields } = this.props;
    const { photoUrl } = values;

    const imageEditDisabled = _.get(fields, 'photoUrl.disabled', false);
    const imageHidden = _.get(fields, 'photoUrl.hidden', false);

    if (isPreview) {
      return null;
    }

    const formTitle = title || formatName(values);

    const image = !imageHidden && {
      photoUrl,
      dimension: AVATAR_DIMENSIONS,
      onChange: this.handleImageChange,
      editable: !imageEditDisabled,
    };

    return (
      <View style={imageHidden && styles.noImage}>
        <FormTitle title={formTitle} image={image} />
      </View>
    );
  }

  @autobind
  renderFormFooter() {
    const { errors, inProgress, hasChanges } = this.state;
    const { buttonTitle, isPreview } = this.props;

    const submitDisabled = !_.isEmpty(errors) || !hasChanges;

    if (isPreview) {
      return null;
    }

    return (
      <Button
        large
        waiting={inProgress}
        disabled={submitDisabled}
        onPress={this.handleSubmitPress}
        title={buttonTitle}
      />
    );
  }

  @autobind
  render() {
    const { isPreview, keyboardAvoidingBehavior } = this.props;

    return (
      <FormContainer
        smartScroll
        keyboardAvoidingBehavior={keyboardAvoidingBehavior}
        TitleComponent={this.renderTitle()}
        FormFooterComponent={this.renderFormFooter()}
        formContainerStyle={!isPreview && formContainer.withHeader}
        scrollContainerStyle={isPreview && formContainer.preview}
      >
        {this.renderDetails()}
        {this.renderEmergencyInfo()}
        {this.renderNotes()}
      </FormContainer>
    );
  }
}

ContactForm.propTypes = {
  keyboardAvoidingBehavior: PropTypes.any,
  values: PropTypes.object,
  isPreview: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  buttonTitle: PropTypes.string,
  title: PropTypes.string,
  fields: PropTypes.objectOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      hidden: PropTypes.bool,
      value: PropTypes.any,
      required: PropTypes.bool,
    })
  ),
};

const formContainer = StyleSheet.create({
  preview: {
    paddingLeft: 0,
  },
  withHeader: {
    paddingTop: 0,
    marginTop: -10,
  },
});

const styles = StyleSheet.create({
  noImage: {
    paddingBottom: 30,
  },
});
