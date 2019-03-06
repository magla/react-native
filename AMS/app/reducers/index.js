// Import action types
import types from '../actionTypes.js'

// The reducer for todo items
export const reducer = (state = initialState, action) => {
  const {type, payload} = action
  const {items, typePersonal} = state
  
  switch (type) {
    case types.ADD_ITEM: {
      return {
        ...state, items: [{ 'name': payload.name, 'id': payload.id }, ...items]
      }
    }

    case types.REMOVE_ITEM: {
      return {
        ...state,
        items: items.filter((item, i) => i !== payload)
      }
    }

    case types.UPDATE_TYPE: {
        async function getTypeFromIds() {
          const like_ids = items.map(function(i){return i['id'].toString()});

          try {
            let response = await fetch(`https://api.applymagicsauce.com/like_ids?traits=BIG5&interpretations=true`, 
              { method: "POST", 
                headers: {
                  'X-Auth-Token': 'bb3tmm3k9rfao55odlfcdk9mgf',
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(["14276376401", "29259828486", "910029689095619", "172873029427580", "71135116848", "29144989109", "153080620724", "8335563918", "766203246743307", "469134276614001"])
              })

              let responseJson = await response.json()

              if (responseJson){
                return responseJson.interpretations[0].value
              } else return 'INTJ'
          } 
          catch(error) {
            alert(error)
          }
        }
      
      let typeP = 'infp'
      getTypeFromIds().then((data) => { 
        typeP = data
        return {
          ...state,
          typePersonal: typeP
        }
      })
    }

    default: {
      return state
    }
  }
}

// Action creators
export const actionCreators = {
  addItem: (item) => {
    return {type: types.ADD_ITEM, payload: item}
  },
  removeItem: (index) => {
    return {type: types.REMOVE_ITEM, payload: index}
  },
  updateType: (item) => {
    return {type: types.UPDATE_TYPE, payload: item}
  }
}
