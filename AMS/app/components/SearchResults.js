import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

export default class SearchResults extends Component {
    constructor(props) {
      super(props);

      this.renderItem = this.renderItem.bind(this);
    }

    renderItem = (item, key, onPress) => {
      return (
        <View key={key}>
          <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
            <Text style={styles.label}>{ item['name'] }</Text>
            <View style={styles.rightSection}>
              <Image
                style={styles.image}
                source={{uri: item.picture.data.url}}
              />
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    render() {
        const {searchItems, onPress} = this.props
        alert(onPress)

        return (
            <ScrollView>
              {searchItems && searchItems.map(this.renderItem.bind(onPress))}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    item: {
      marginBottom: 5,
      padding: 15,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'whitesmoke'
    },
    image: {
      width: 60, 
      height: 60,
      alignSelf: 'flex-end'
    },
    label: {
      fontSize: 18
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  })
