import axios from 'axios'
import {
	USER_SIGNIN_REQUEST,
	USER_SIGNIN_SUCCESS,
	USER_SIGNIN_FAIL,
	USER_SIGNOUT,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_SIGNUP_FAIL,
	USER_PREFERENCES_SET_THEME,
	USER_CHANGE_PASSWORD_REQUEST,
	USER_CHANGE_PASSWORD_SUCCESS,
	USER_CHANGE_PASSWORD_FAIL
} from '../constants/userConstants'

export const signIn = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_SIGNIN_REQUEST })

		const config = {
			headers : {
				'Content-Type' : 'application/json'
			}
		}

		const { data } = await axios.post('/api/users/signin', { email, password }, config)

		dispatch({
			type    : USER_SIGNIN_SUCCESS,
			payload : data
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type    : USER_SIGNIN_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const signUp = (email, username, password, passwordConfirmation) => async (dispatch) => {
	try {
		dispatch({ type: USER_SIGNUP_REQUEST })

		const config = {
			headers : {
				'Content-Type' : 'application/json'
			}
		}

		const { data } = await axios.post(
			'/api/users/signup',
			{ email, username, password, passwordConfirmation },
			config
		)

		dispatch({
			type    : USER_SIGNIN_SUCCESS,
			payload : data
		})

		dispatch({
			type    : USER_SIGNUP_SUCCESS,
			payload : data
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type    : USER_SIGNUP_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const changePassword = (passwordCurrent, passwordNew, passwordNewConfirmation) => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_CHANGE_PASSWORD_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/users/password', { passwordCurrent, passwordNew, passwordNewConfirmation }, config)

		dispatch({
			type : USER_CHANGE_PASSWORD_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : USER_CHANGE_PASSWORD_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const signOut = () => async (dispatch) => {
	localStorage.removeItem('userInfo')

	dispatch({ type: USER_SIGNOUT })
}

export const setCurrentTheme = (theme) => async (dispatch) => {
	localStorage.setItem('currentTheme', JSON.stringify(theme))

	dispatch({ type: USER_PREFERENCES_SET_THEME, payload: theme })
}
