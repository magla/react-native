import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class List extends Component {
    renderItem = (item, key) => {
        const {onRemoveItem} = this.props

        return (
          <View style={styles.item} key={key}>
            <Text style={item.completed ? [styles.label, styles.completed] : styles.label}>{ item['name'] }</Text>
            <View style={styles.rightSection}>
              <TouchableOpacity style={styles.touchable} onPress={() => onRemoveItem(key)}>
               <Text style={styles.remove}> &times; </Text>
             </TouchableOpacity>
            </View>
          </View>
        )
    }

    render() {
        const {items} = this.props

        return (
            <ScrollView>
                {items && items.map(this.renderItem)}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    item: {
      marginBottom: 5,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'whitesmoke',
    },
    completed: {
      opacity: 0.3
    },
    label: {
      fontSize: 18
    },
    touchable: {
      backgroundColor: '#DE7866'
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    remove: {
      fontSize: 22,
      color: 'white',
      height: 30,
      width: 30,
      textAlign: 'center'
    }
  })
