import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'
import { bggGetCollection } from '../../actions/collectionActions'
import { SALE_LIST_RESET } from '../../constants/gameConstants'

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

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading, success } = bggCollection

	useEffect(
		() => {
			if (success) {
				dispatch({ type: SALE_LIST_RESET })
				history.push('/collection')
			}
		},
		[ dispatch, success, history ]
	)

	const submitToBGGHandler = (e) => {
		e.preventDefault()

		dispatch(bggGetCollection(bggUsername))
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
