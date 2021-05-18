import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userSignInReducer, userSignUpReducer } from './reducers/userReducers'
import { bggGetCollectionReducer, dbGetCollectionReducer } from './reducers/collectionReducers'
import { bggGetGameDetailsReducer, saleListReducer } from './reducers/gameReducers'

const reducer = combineReducers({
	userSignIn     : userSignInReducer,
	userSignUp     : userSignUpReducer,
	bggCollection  : bggGetCollectionReducer,
	bggGameDetails : bggGetGameDetailsReducer,
	dbCollection   : dbGetCollectionReducer,
	saleList       : saleListReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const saleListFromStorage = localStorage.getItem('saleList') ? JSON.parse(localStorage.getItem('saleList')) : []

const initialState = {
	userSignIn : { userInfo: userInfoFromStorage },
	saleList   : saleListFromStorage
}

const middleware = [ thunk ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
