import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

export default class RemoveButton extends Component {
    render () {
        const remove = 'Remove all completed items'

        return (
            <View style={styles.button}>
                <Text style={styles.text}>{remove}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#DE7866',
      padding: 10
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold'
    }
})
