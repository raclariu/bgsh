import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { checkTokenExpirationMiddleware } from './middlewares/middlewares'

import { userAuthReducer, userChangePasswordReducer, setThemeReducer } from './reducers/userReducers'
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
	updateMessageReducer,
	getReceivedMessagesReducer,
	getSentMessagesReducer,
	getNewMessagesCountReducer,
	deleteMessagesReducer
} from './reducers/messageReducers'

const reducer = combineReducers({
	userAuth         : userAuthReducer,
	userPreferences  : setThemeReducer,
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

// const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
// 	// const token =
// 	//   JSON.parse(localStorage.getItem("user")) &&
// 	//   JSON.parse(localStorage.getItem("user"))["token"];
// 	// if (jwtDecode(token).exp < Date.now() / 1000) {
// 	//   next(action);
// 	//   localStorage.clear();
// 	// }
// 	// next(action);
// 	console.log('asd')
// }

const middleware = [ thunk, checkTokenExpirationMiddleware ]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
