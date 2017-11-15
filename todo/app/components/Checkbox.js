import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'

export default class CheckboxItem extends Component {
  render() {
    const {onToggle, isChecked} = this.props

    return (
      <TouchableWithoutFeedback onPress={onToggle}>
        <View style={styles.box}>
          { isChecked && <View style={styles.inner}><Text> &#10004; </Text></View> }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    height: 30,
    width: 30,
    borderWidth: 2,
    borderColor: '#374456',
    marginRight: 20
  },
  completed: {
    opacity: 0.2
  },
  inner: {
    flex: 1,
    marginLeft: 2,
    marginTop: 2
  }
})
