import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class Title extends Component {
    render () {
        const title = 'To Do'

        return (
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#374456',
      padding: 20,
      paddingTop: 40
    },
    title: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    }
})
