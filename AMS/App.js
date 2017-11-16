import React, { Component } from 'react'
import { Provider } from 'react-redux'

// Import the App container component
import configureStore from './app/store/configureStore'
import Main from './app/containers/Main'

const initialState = {}

// Init store
const store = configureStore(initialState)

// Pass the store into the Provider
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}
