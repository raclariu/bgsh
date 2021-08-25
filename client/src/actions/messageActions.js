import axios from 'axios'
import {
	SEND_MESSAGE_REQUEST,
	SEND_MESSAGE_SUCCESS,
	SEND_MESSAGE_FAIL,
	GET_MESSAGES_REQUEST,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL,
	GET_NEW_MESSAGES_COUNT_REQUEST,
	GET_NEW_MESSAGES_COUNT_SUCCESS,
	GET_NEW_MESSAGES_COUNT_FAIL
} from '../constants/messageConstants'

export const sendMessage = (subject, message, recipientUsername, recipientId) => async (dispatch, getState) => {
	try {
		dispatch({ type: SEND_MESSAGE_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/messages', { subject, message, recipientUsername, recipientId }, config)

		dispatch({
			type : SEND_MESSAGE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : SEND_MESSAGE_FAIL,
			payload : error.response && error.response.data ? { ...error.response.data.message } : error.message
		})
	}
}

export const getAllMessages = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_MESSAGES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get('/api/messages', config)

		dispatch({
			type    : GET_MESSAGES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_MESSAGES_FAIL,
			payload : error.response && error.response.data ? { ...error.response.data.message } : error.message
		})
	}
}

export const getNewMessagesCount = () => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_NEW_MESSAGES_COUNT_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		const { data } = await axios.get('/api/messages/new', config)

		dispatch({
			type    : GET_NEW_MESSAGES_COUNT_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_NEW_MESSAGES_COUNT_FAIL,
			payload : error.response && error.response.data ? { ...error.response.data.message } : error.message
		})
	}
}
