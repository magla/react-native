// Import action types
import types from '../actionTypes.js'

// Initial state
const initialState = {}

// The reducer for type
export const search = (state = initialState, action) => {
  const {typeOfAction, payload} = action

  // To Do
  switch (typeOfAction) {
    case types.UPDATE_SEARCH: {
      return state
    }

    default: {
      return state
    }
  }
}
