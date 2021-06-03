import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Loader from './Loader'
import { bggGetCollection } from '../actions/collectionActions'
import { SALE_LIST_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	paper  : {
		padding : theme.spacing(1.2, 1.5, 1.2, 1.5)
	},
	button : {
		display        : 'flex',
		alignContent   : 'center',
		justifyContent : 'flex-end'
	}
}))

const CollectionFetchBox = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ bggUsername, setBggUsername ] = useState('')

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading, error, success } = bggCollection

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
		if (bggUsername.trim().length > 3) {
			dispatch(bggGetCollection(bggUsername))
		}
	}

	return (
		<Fragment>
			<form onSubmit={submitToBGGHandler} autoComplete="off">
				<TextField
					onChange={(e) => setBggUsername(e.target.value)}
					value={bggUsername}
					error={error ? true : false}
					helperText={error ? error : ' '}
					id="bggUsername"
					name="bggUsername"
					label="Import collection"
					placeholder="Enter your boardgamegeek username"
					type="text"
					variant="outlined"
					fullWidth
					InputProps={{
						endAdornment : <Fragment>{loading ? <Loader color="inherit" size={20} /> : null}</Fragment>
					}}
				/>

				<div className={cls.button}>
					<Button type="submit" size="small" variant="outlined" disabled={loading} color="primary">
						Import
					</Button>
				</div>
			</form>
		</Fragment>
	)
}

export default CollectionFetchBox
