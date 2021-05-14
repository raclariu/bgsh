import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { bggGetCollection } from '../../actions/collectionActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'

const useStyles = makeStyles((theme) => ({
	button : {
		marginTop : theme.spacing(1)
	}
}))

const CollectionFetchBox = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ bggUsername, setBggUsername ] = useState('')

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading, success } = bggCollection

	useEffect(
		() => {
			if (success) {
				history.push('collection')
			}
		},
		[ success, history ]
	)

	const submitToBGGHandler = (e) => {
		e.preventDefault()

		if (userInfo) {
			dispatch(bggGetCollection(bggUsername))
		} else {
			history.push('/signin')
		}
	}

	return (
		<form noValidate autoComplete="off">
			<TextField
				onChange={(e) => setBggUsername(e.target.value)}
				value={bggUsername}
				id="bggUsername"
				name="bggUsername"
				placeholder="Your BGG Username"
				type="text"
			/>

			<Button
				className={cls.button}
				onClick={submitToBGGHandler}
				disabled={bggUsername.length < 4 || loading}
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
			>
				{loading ? <Loader size={24} color="inherit" /> : 'Get Collection'}
			</Button>
		</form>
	)
}

export default CollectionFetchBox
