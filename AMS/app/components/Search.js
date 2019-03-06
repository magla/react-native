import React, { Component } from 'react'
import { TextInput, StyleSheet, Alert, View } from 'react-native'

export default class Input extends Component {
  render() {
    const {onChangeText, onFocus, placeholder, searchText} = this.props

    return (
      <View>
        <TextInput
          onFocus={onFocus}
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={onChangeText}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    height: 75,
    padding: 15,
    fontSize: 18
  },
})
