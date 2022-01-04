import jwt_decode from 'jwt-decode'
import { signOut } from '../actions/userActions'

// export const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
// 	const token = JSON.parse(localStorage.getItem('userData')) && JSON.parse(localStorage.getItem('userData'))['token']
// 	console.log(action)
// 	if (token) {
// 		if (jwt_decode(token).exp < Date.now() / 1000) {
// 			console.log('expired token => ', jwt_decode(token).exp, Date.now() / 1000)
// 			// next(action)
// 			store.dispatch(signOut())
// 		}
// 	}

// 	next(action)
// }

// export const logger = (store) => (next) => (action) => {
// 	console.group(action.type)
// 	const oldState = store.getState()
// 	console.log('current state', oldState)
// 	console.info(`dispatching`, action)
// 	let result = next(action)
// 	const newState = store.getState()
// 	console.log('next state', newState)
// 	console.groupEnd()
// 	return result
// }
