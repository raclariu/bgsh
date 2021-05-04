import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { getCollectionFromBGG } from '../actions/collectionActions'

const useStyles = makeStyles((theme) => ({
	button : {
		marginTop : theme.spacing(1)
	}
}))

const GetCollectionBox = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ bggUsername, setBggUsername ] = useState('')

	const userCollectionDB = useSelector((state) => state.userCollectionDB)
	const { error } = userCollectionDB

	const submitToBGGHandler = (e) => {
		e.preventDefault()
		dispatch(getCollectionFromBGG(bggUsername))
		history.push('/collection')
	}

	return (
		<form>
			<Grid item>
				<TextField
					error={error && error.errors.bggUsernameError ? true : false}
					helperText={error ? error.errors.bggUsernameError : false}
					onChange={(e) => setBggUsername(e.target.value)}
					value={bggUsername}
					variant="outlined"
					id="bggUsername"
					label="Your BGG username"
					type="text"
					fullWidth
				/>
			</Grid>
			<Grid item>
				<Button
					className={classes.button}
					onClick={submitToBGGHandler}
					disabled={bggUsername.length < 4}
					type="submit"
					variant="contained"
					color="primary"
					size="large"
					fullWidth
				>
					Get Collection
				</Button>
			</Grid>
		</form>
	)
}

export default GetCollectionBox
