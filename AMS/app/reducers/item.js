
// Import action types
import types from '../actionTypes.js'

// Initial state
const initialState = {}

// The reducer for todo items
export const item = (state = initialState, action) => {
  const {typeOfAction, payload} = action
  const {items} = state
  const {type} = state

  switch (typeOfAction) {
    case types.ADD_ITEM: {
      return {
        ...state, items: [{'label': payload, 'completed': false}, ...items]
      }
    }

    case types.REMOVE_ITEM: {
      return {
        ...state,
        items: items.filter((item, i) => i !== payload)
      }
    }

    default: {
      return state
    }
  }
}
