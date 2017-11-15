import React, { Component } from 'react'
import { View, StyleSheet, Alert } from 'react-native'

// State management
import { connect } from 'react-redux'
import { actionCreators } from '../reducers/item'

// Components
import Title from '../components/Title'
import List from '../components/List'
import Input from '../components/Input'
import Footer from '../components/Footer'

// Map state for Redux
const mapStateToProps = (state) => ({
  items: state.items
})

// App Component
class App extends Component {

    // Dispatch actions
    addItem = (item) => {
      const {dispatch} = this.props
      dispatch(actionCreators.addItem(item))
    }

    removeItem = (index) => {
      const {dispatch} = this.props
      dispatch(actionCreators.removeItem(index))
    }

    toggleItemCompleted = (index) => {
      const {dispatch} = this.props
      dispatch(actionCreators.toggleItemCompleted(index))
    }

    removeCompleted = () => {
      const {dispatch} = this.props
      dispatch(actionCreators.removeCompleted())
    }

    // Render function
    render() {
        const {items} = this.props
        const check = items.some((item, i) => {
          return item['completed'] === true
        })

        return (
            <View contentContainerStyle={styles.contentContainer}>
                <Title/>
                <Input
                  placeholder={'Enter a todo'}
                  onSubmit={this.addItem}
                />
                <List
                  items={items}
                  onRemoveItem={this.removeItem}
                  onToggleItemCompleted={this.toggleItemCompleted}/>
                <Footer onRemoveCompleted={this.removeCompleted} check={check}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#F8E2B9'
    }
})

export default connect(mapStateToProps)(App)
