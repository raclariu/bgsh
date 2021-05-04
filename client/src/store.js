import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userSignInReducer, userSignUpReducer } from './reducers/userReducers'
import { getCollectionFromBGGReducer, getCollectionFromDBReducer } from './reducers/collectionReducers'

const reducer = combineReducers({
	userSignIn        : userSignInReducer,
	userSignUp        : userSignUpReducer,
	userCollectionBGG : getCollectionFromBGGReducer,
	userCollectionDB  : getCollectionFromDBReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
	userSignIn : { userInfo: userInfoFromStorage }
}

const middleware = [ thunk ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
