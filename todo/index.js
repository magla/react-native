import React, { Component } from 'react'
import Alert from 'react-native'
import { Provider } from 'react-redux'

// Import the App container component
import configureStore from './app/store/configure'
import App from './app/containers/App'

const initialState = { items: [{'label': 'Item #1', 'completed': false}] }

// Init store
const store = configureStore(initialState)

// Pass the store into the Provider
export default class extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
