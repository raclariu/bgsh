import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'
import { bggGetCollection } from '../../actions/collectionActions'

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
	const { loading } = bggCollection

	const submitToBGGHandler = (e) => {
		e.preventDefault()

		if (userInfo) {
			dispatch(bggGetCollection(bggUsername))
			history.push('/collection')
		} else {
			history.push('/signin')
		}
	}

	return (
		<form>
			<Grid item>
				<TextField
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
					className={cls.button}
					onClick={submitToBGGHandler}
					disabled={bggUsername.length < 4 || loading}
					type="submit"
					variant="contained"
					color="primary"
					size="large"
					fullWidth
				>
					{loading ? <Loader size={26} color="inherit" /> : 'Get Collection'}
				</Button>
			</Grid>
		</form>
	)
}

export default CollectionFetchBox
