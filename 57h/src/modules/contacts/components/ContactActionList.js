import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { PlainItem, ButtonItem } from '~/components/list';
import { Text } from '~/components/ui';
import { getShareActionTitle } from '../services/share';
import { SHARE_SOURCES } from '../const';

export default function ContactActionList({
  style,
  contactSize,
  onShareProfilePress,
  onShareProgramsPress,
  onSendMessagePress,
}) {
  const shareTitle = getShareActionTitle(contactSize, SHARE_SOURCES.PROFILE);
  const showBorderTop = contactSize === 1;

  const showShareProfileOption = _.isFunction(onShareProfilePress);
  const showShareProgramsOption = _.isFunction(onShareProgramsPress);
  const showSendMessageOption = _.isFunction(onSendMessagePress);

  return (
    <View style={style && style.container}>
      {showShareProfileOption && (
        <ButtonItem
          borderTop={showBorderTop}
          style={textStyles}
          onPress={onShareProfilePress}
          leftIcon="Reply"
        >
          <Text>{shareTitle}</Text>
        </ButtonItem>
      )}
      {showShareProgramsOption && (
        <ButtonItem
          style={textStyles}
          onPress={onShareProgramsPress}
          leftIcon="Programs"
        >
          <Text>Share your programs</Text>
        </ButtonItem>
      )}
      {showSendMessageOption && (
        <PlainItem onPress={onSendMessagePress} leftIcon="Message">
          <Text>Send client a message</Text>
        </PlainItem>
      )}
    </View>
  );
}

const textStyles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    flexBasis: 64,
  },
});

const { number, func, oneOfType, object, array } = PropTypes;

ContactActionList.propTypes = {
  contactSize: number,
  style: oneOfType([object, array]),
  onShareProfilePress: func,
  onShareProgramsPress: func,
  onSendMessagePress: func,
};
