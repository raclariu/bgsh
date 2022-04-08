import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userAuthReducer, setThemeReducer, getMeReducer } from './reducers/userReducers'

const reducer = combineReducers({
	userToken       : userAuthReducer,
	userPreferences : setThemeReducer,
	userData        : getMeReducer
})

const userDataFromStorage = localStorage.getItem('userToken') ? JSON.parse(localStorage.getItem('userToken')) : null
const currentThemeFromStorage = localStorage.getItem('currentTheme')
	? JSON.parse(localStorage.getItem('currentTheme'))
	: 'light'

const initialState = {
	userToken       : userDataFromStorage,
	userPreferences : { theme: currentThemeFromStorage }
}

const middleware = [ thunk ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
