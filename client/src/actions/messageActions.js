import axios from 'axios'
import {
	SEND_MESSAGE_REQUEST,
	SEND_MESSAGE_SUCCESS,
	SEND_MESSAGE_FAIL,
	GET_RECEIVED_MESSAGES_REQUEST,
	GET_RECEIVED_MESSAGES_SUCCESS,
	GET_RECEIVED_MESSAGES_FAIL,
	GET_SENT_MESSAGES_REQUEST,
	GET_SENT_MESSAGES_SUCCESS,
	GET_SENT_MESSAGES_FAIL,
	GET_NEW_MESSAGES_COUNT_REQUEST,
	GET_NEW_MESSAGES_COUNT_SUCCESS,
	GET_NEW_MESSAGES_COUNT_FAIL,
	DELETE_MESSAGES_REQUEST,
	DELETE_MESSAGES_SUCCESS,
	DELETE_MESSAGES_FAIL
} from '../constants/messageConstants'

export const sendMessage = (subject, message, recipientUsername) => async (dispatch, getState) => {
	try {
		dispatch({ type: SEND_MESSAGE_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			}
		}

		await axios.post('/api/messages', { subject, message, recipientUsername }, config)

		dispatch({
			type : SEND_MESSAGE_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : SEND_MESSAGE_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getReceivedMessages = (page) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_RECEIVED_MESSAGES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			},
			params  : {
				page : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/messages/received', config)

		dispatch({
			type    : GET_RECEIVED_MESSAGES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_RECEIVED_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const getSentMessages = (page) => async (dispatch, getState) => {
	try {
		dispatch({ type: GET_SENT_MESSAGES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			},
			params  : {
				page : +page ? +page : 1
			}
		}

		const { data } = await axios.get('/api/messages/sent', config)

		dispatch({
			type    : GET_SENT_MESSAGES_SUCCESS,
			payload : data
		})
	} catch (error) {
		dispatch({
			type    : GET_SENT_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}

export const deleteMessages = (ids) => async (dispatch, getState) => {
	try {
		dispatch({ type: DELETE_MESSAGES_REQUEST })

		const { userSignIn: { userInfo } } = getState()

		const config = {
			headers : {
				'Content-Type' : 'application/json',
				Authorization  : `Bearer ${userInfo.token}`
			},
			data    : {
				ids
			}
		}

		await axios.delete('/api/messages/delete', config)

		dispatch({
			type : DELETE_MESSAGES_SUCCESS
		})
	} catch (error) {
		dispatch({
			type    : DELETE_MESSAGES_FAIL,
			payload : error.response && error.response.data ? error.response.data.message : error.message
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
			payload : error.response && error.response.data ? error.response.data.message : error.message
		})
	}
}
