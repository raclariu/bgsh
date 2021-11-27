import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { checkTokenExpirationMiddleware } from './middlewares/middlewares'

import {
	userAuthReducer,
	userChangePasswordReducer,
	setThemeReducer,
	getUserProfileDataReducer
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
	addWantedGamesReducer,
	getGamesReducer,
	getWantedGamesReducer,
	getSingleGameReducer,
	savedGameStatusReducer,
	savedGamesListReducer,
	getUserListedGamesReducer,
	getUserWantedGamesReducer,
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
	updateMessageReducer,
	getReceivedMessagesReducer,
	getSentMessagesReducer,
	getNewMessagesCountReducer,
	deleteMessagesReducer
} from './reducers/messageReducers'
import { getKickstartersReducer } from './reducers/miscReducers'

const reducer = combineReducers({
	userAuth         : userAuthReducer,
	userPreferences  : setThemeReducer,
	userProfileData  : getUserProfileDataReducer,
	sendMessage      : sendMessageReducer,
	updateMessage    : updateMessageReducer,
	messagesReceived : getReceivedMessagesReducer,
	messagesSent     : getSentMessagesReducer,
	deleteMessages   : deleteMessagesReducer,
	newMessagesCount : getNewMessagesCountReducer,
	changePassword   : userChangePasswordReducer,
	bggCollection    : bggGetCollectionReducer,
	dbCollection     : dbGetCollectionReducer,
	bggGamesDetails  : bggGetGamesDetailsReducer,
	bggSearchGames   : bggSearchGamesReducer,
	bggHotGames      : bggGetHotGamesReducer,
	bggGallery       : bggGetGalleryReducer,
	gamesIndex       : getGamesReducer,
	wantedGamesIndex : getWantedGamesReducer,
	gameForSale      : getSingleGameReducer,
	userListedGames  : getUserListedGamesReducer,
	userWantedGames  : getUserWantedGamesReducer,
	wishlist         : getWishlistReducer,
	saleList         : saleListReducer,
	sellGames        : sellGamesReducer,
	tradeGames       : tradeGamesReducer,
	addWantedGames   : addWantedGamesReducer,
	savedGameStatus  : savedGameStatusReducer,
	savedGamesList   : savedGamesListReducer,
	addToHistory     : addToHistoryReducer,
	soldHistory      : getSoldGamesHistoryReducer,
	tradedHistory    : getTradedGamesHistoryReducer,
	deleteGame       : deleteGameReducer,
	reactivateGame   : reactivateGameReducer,
	kickstartersList : getKickstartersReducer
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
