
import { createStore, applyMiddleware } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'

// Import the reducer and create a store
import { reducer } from '../reducers/item'

const middleware = [ thunk ]

// Add the thunk middleware to our store
export default (initialState) => {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware),
  )

  return store
}
