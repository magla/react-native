// React
import { combineReducers } from 'redux'

// Reducers import
import { search } from './search'
import { item } from './item'

// Import action types
import types from '../actionTypes.js'

// Export reducer
export const reducer = combineReducers({ item, search })

// Action creators
export const actionCreators = {
  addItem: (item) => {
    return {type: types.ADD_ITEM, payload: item}
  },
  removeItem: (index) => {
    return {type: types.REMOVE_ITEM, payload: index}
  },
  updateSearch: () => {
    return {type: types.UPDATE_SEARCH}
  }
}
