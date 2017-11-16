import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { actionCreators } from '../reducers/item'

export default class SearchResults extends Component {
    constructor(props) {
      super(props);

      this.addItem = this.addItem.bind(this);
    }

    // Dispatch actions
    addItem(item) {
      const {dispatch} = this.props
      alert(item)
      dispatch(actionCreators.addItem(item))
    }

    renderItem = (item, key) => {
      return (
        <View style={styles.item} key={key}>
          <TouchableOpacity onPress={() => this.addItem(item)}>
            <Text style={styles.label}>{ item['name'] }</Text>
            <View style={styles.rightSection}>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: item.picture.data.url}}
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    render() {
        const {searchItems} = this.props

        return (
            <ScrollView>
              {searchItems && searchItems.map(this.renderItem)}
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
    label: {
      fontSize: 18
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    }
  })
