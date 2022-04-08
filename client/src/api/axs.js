import store from '../store'
import axios from 'axios'
import { logOut } from '../actions/userActions'

const getBearer = () => {
	const state = store.getState()

	return state.userToken
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
		const token = getBearer()
		if (!config.headers.Authorization && token) {
			config.headers.Authorization = `Bearer ${token}`
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
			store.dispatch(logOut())
		}
		return Promise.reject(error)
	}
)
