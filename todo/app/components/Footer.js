import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import RemoveButton from './RemoveButton'

export default class Footer extends Component {
    render () {
        const {onRemoveCompleted, check} = this.props

        return (
            <View style={styles.footer}>
              <Text>{check}</Text>
              {check && <TouchableOpacity onPress={onRemoveCompleted}><RemoveButton /></TouchableOpacity>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
      padding: 20
    }
})
