import React, { Component } from 'react'
import { View } from 'react-native'
import Results from './Results'

export default class SearchResults extends Component {
  render() {
    const {searchItems, onPress, expanded} = this.props

    return (
      <View>
        { expanded ? <Results expanded={expanded} searchItems={searchItems} onPress={onPress} /> : null }
      </View>
    )
  }
}

