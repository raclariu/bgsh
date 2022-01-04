import store from '../store'
import axios from 'axios'
import { signOut } from '../actions/userActions'

const getBearer = () => {
	const state = store.getState()
	return `Bearer ${state.userAuth.userData.token}`
}

export const axsAUTH = axios.create({
	baseURL : '/',
	headers : {
		'Content-Type' : 'application/json'
	}
})

export const axsPUBLIC = axios.create({
	baseURL : '/',
	headers : {
		'Content-Type' : 'application/json'
	}
})

axsAUTH.interceptors.request.use(
	(config) => {
		if (!config.headers.Authorization) {
			config.headers.Authorization = getBearer()
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

axsAUTH.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			store.dispatch(signOut())
		}
		return Promise.reject(error)
	}
)
