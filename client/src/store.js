import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userSignInReducer, userSignUpReducer } from './reducers/userReducers'
import { bggGetCollectionReducer, dbGetCollectionReducer, getWishlistReducer } from './reducers/collectionReducers'
import {
	bggGetGamesDetailsReducer,
	saleListReducer,
	bggSearchGamesReducer,
	sellGamesReducer,
	getGamesReducer,
	getSingleGameReducer,
	savedGameStatusReducer,
	savedGamesListReducer,
	getUserGamesReducer
} from './reducers/gameReducers'

const reducer = combineReducers({
	userSignIn      : userSignInReducer,
	userSignUp      : userSignUpReducer,
	bggCollection   : bggGetCollectionReducer,
	dbCollection    : dbGetCollectionReducer,
	bggGamesDetails : bggGetGamesDetailsReducer,
	bggSearchGames  : bggSearchGamesReducer,
	gamesIndex      : getGamesReducer,
	gameForSale     : getSingleGameReducer,
	userGames       : getUserGamesReducer,
	wishlist        : getWishlistReducer,
	saleList        : saleListReducer,
	sellGames       : sellGamesReducer,
	savedGameStatus : savedGameStatusReducer,
	savedGamesList  : savedGamesListReducer
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
