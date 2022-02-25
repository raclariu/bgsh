import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userAuthReducer, setThemeReducer } from './reducers/userReducers'

const reducer = combineReducers({
	userAuth        : userAuthReducer,
	userPreferences : setThemeReducer
})

const userDataFromStorage = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
const currentThemeFromStorage = localStorage.getItem('currentTheme')
	? JSON.parse(localStorage.getItem('currentTheme'))
	: 'light'

const initialState = {
	userAuth        : { userData: userDataFromStorage },
	userPreferences : { theme: currentThemeFromStorage }
}

const middleware = [ thunk ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
