import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { checkTokenExpirationMiddleware } from './middlewares/middlewares'

import { userAuthReducer, setThemeReducer } from './reducers/userReducers'
import { saleListReducer } from './reducers/saleListReducers'

const reducer = combineReducers({
	userAuth        : userAuthReducer,
	userPreferences : setThemeReducer,
	saleList        : saleListReducer
})

const userDataFromStorage = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
const saleListFromStorage = localStorage.getItem('saleList') ? JSON.parse(localStorage.getItem('saleList')) : []
const currentThemeFromStorage = localStorage.getItem('currentTheme')
	? JSON.parse(localStorage.getItem('currentTheme'))
	: 'light'

const initialState = {
	userAuth        : { userData: userDataFromStorage },
	saleList        : saleListFromStorage,
	userPreferences : { theme: currentThemeFromStorage }
}

const middleware = [ thunk, checkTokenExpirationMiddleware ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
