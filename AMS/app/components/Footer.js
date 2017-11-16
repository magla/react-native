import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

export default class Footer extends Component {
    render () {
        const {check, type} = this.props

        return (
            <View>{check && <View style={styles.footer}><Text style={styles.type}>{type}</Text></View> }</View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
      padding: 20,
      backgroundColor: 'maroon'
    },
    type: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center'
    }
})
