import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
	userSignInReducer,
	userSignUpReducer,
	userChangePasswordReducer,
	setThemeReducer
} from './reducers/userReducers'
import { bggGetCollectionReducer, dbGetCollectionReducer, getWishlistReducer } from './reducers/collectionReducers'
import {
	bggGetGamesDetailsReducer,
	saleListReducer,
	bggSearchGamesReducer,
	sellGamesReducer,
	tradeGamesReducer,
	getGamesReducer,
	getSingleGameReducer,
	savedGameStatusReducer,
	savedGamesListReducer,
	getUserActiveGamesReducer,
	deleteGameReducer,
	reactivateGameReducer
} from './reducers/gameReducers'
import {
	addToHistoryReducer,
	getSoldGamesHistoryReducer,
	getTradedGamesHistoryReducer
} from './reducers/historyReducers'

const reducer = combineReducers({
	userSignIn      : userSignInReducer,
	userSignUp      : userSignUpReducer,
	userPreferences : setThemeReducer,
	changePassword  : userChangePasswordReducer,
	bggCollection   : bggGetCollectionReducer,
	dbCollection    : dbGetCollectionReducer,
	bggGamesDetails : bggGetGamesDetailsReducer,
	bggSearchGames  : bggSearchGamesReducer,
	gamesIndex      : getGamesReducer,
	gameForSale     : getSingleGameReducer,
	userActiveGames : getUserActiveGamesReducer,
	wishlist        : getWishlistReducer,
	saleList        : saleListReducer,
	sellGames       : sellGamesReducer,
	tradeGames      : tradeGamesReducer,
	savedGameStatus : savedGameStatusReducer,
	savedGamesList  : savedGamesListReducer,
	addToHistory    : addToHistoryReducer,
	soldHistory     : getSoldGamesHistoryReducer,
	tradedHistory   : getTradedGamesHistoryReducer,
	deleteGame      : deleteGameReducer,
	reactivateGame  : reactivateGameReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const saleListFromStorage = localStorage.getItem('saleList') ? JSON.parse(localStorage.getItem('saleList')) : []
const currentThemeFromStorage = localStorage.getItem('currentTheme')
	? JSON.parse(localStorage.getItem('currentTheme'))
	: 'light'

const initialState = {
	userSignIn      : { userInfo: userInfoFromStorage },
	saleList        : saleListFromStorage,
	userPreferences : { theme: currentThemeFromStorage }
}

const middleware = [ thunk ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
