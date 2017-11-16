import React, { Component } from 'react'
import { View, StyleSheet, Alert, ScrollView } from 'react-native'

// State management
import { connect } from 'react-redux'
import { actionCreators } from '../reducers/item'

// Components
import Title from '../components/Title'
import Search from '../components/Search'
import SearchResults from '../components/SearchResults'
import List from '../components/List'
import Footer from '../components/Footer'

// Map state for Redux
const mapStateToProps = (state) => ({
  items: state.items,
  type: state.type
})

// Main Component
class Main extends Component {
    state = {
      searchText: '',
      searchResultsOpen: false
    }

    removeItem = (index) => {
      const {dispatch} = this.props
      dispatch(actionCreators.removeItem(index))
    }

    // Local state change
    updateSearch = (searchText) => {
      const that = this

      // Local state
      this.setState({ ...this.state, searchText: searchText })

      async function getResultsFromApi() {
        try {
          let data = { q: searchText, access_token: '1557226027634035|tTd047b9qttf2VlmHN08cCsoruE', type: 'page' }
          let response = await fetch(`https://graph.facebook.com/search?q=${data.q}&fields=id,name,picture&access_token=${data.access_token}&type=${data.type}`)
          let responseJson = await response.json()
          that.setState({ ...that.state, searchItems: responseJson.data})
        } catch(error) {
          alert(error)
        }
      }

      getResultsFromApi();
    }

    toggleSearch = () => {
      const searchResultsOpen = this.state.searchResultsOpen
      this.setState({searchResultsOpen: !searchResultsOpen})
    }

    // Render function
    render() {
        const {items, type} = this.props
        const {searchResultsOpen, searchText, searchItems} = this.state

        // Calculated value
        const check = items && items.length > 0

        return (
          <View contentContainerStyle={styles.contentContainer}>
            <ScrollView>
              <Title/>

              <Search
                onFocus={this.toggleSearch}
                searchText={searchText}
                expanded={searchResultsOpen}
                searchItems={searchItems}
                onChangeText={this.updateSearch}
                placeholder={'Enter a like'}
                onSubmit={this.addItem}/>

              <SearchResults searchItems={searchItems} />

              <List
                items={items}
                onRemoveItem={this.removeItem}/>
            </ScrollView>

            <View>
              <Footer type={type} check={check}/>
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#F8E2B9'
    }
})

export default connect(mapStateToProps)(Main)
