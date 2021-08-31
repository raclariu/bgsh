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
	bggGetHotGamesReducer,
	bggGetGalleryReducer,
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
import {
	sendMessageReducer,
	getReceivedMessagesReducer,
	getSentMessagesReducer,
	getNewMessagesCountReducer
} from './reducers/messageReducers'

const reducer = combineReducers({
	userSignIn       : userSignInReducer,
	userSignUp       : userSignUpReducer,
	userPreferences  : setThemeReducer,
	sendMessage      : sendMessageReducer,
	messagesReceived : getReceivedMessagesReducer,
	messagesSent     : getSentMessagesReducer,
	newMessagesCount : getNewMessagesCountReducer,
	changePassword   : userChangePasswordReducer,
	bggCollection    : bggGetCollectionReducer,
	dbCollection     : dbGetCollectionReducer,
	bggGamesDetails  : bggGetGamesDetailsReducer,
	bggSearchGames   : bggSearchGamesReducer,
	bggHotGames      : bggGetHotGamesReducer,
	bggGallery       : bggGetGalleryReducer,
	gamesIndex       : getGamesReducer,
	gameForSale      : getSingleGameReducer,
	userActiveGames  : getUserActiveGamesReducer,
	wishlist         : getWishlistReducer,
	saleList         : saleListReducer,
	sellGames        : sellGamesReducer,
	tradeGames       : tradeGamesReducer,
	savedGameStatus  : savedGameStatusReducer,
	savedGamesList   : savedGamesListReducer,
	addToHistory     : addToHistoryReducer,
	soldHistory      : getSoldGamesHistoryReducer,
	tradedHistory    : getTradedGamesHistoryReducer,
	deleteGame       : deleteGameReducer,
	reactivateGame   : reactivateGameReducer
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
