import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined'
import ClearIcon from '@material-ui/icons/Clear'
import { bggGetCollection } from '../../actions/collectionActions'
import { SALE_LIST_RESET } from '../../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	paper  : {
		padding : theme.spacing(1.2, 1, 1.2, 2)
	},
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

		if (bggUsername.trim().length > 3) {
			dispatch(bggGetCollection(bggUsername))
		}
	}

	return (
		<Paper
			component="form"
			className={cls.paper}
			elevation={2}
			onSubmit={submitToBGGHandler}
			noValidate
			autoComplete="off"
		>
			<InputBase
				onChange={(e) => setBggUsername(e.target.value)}
				value={bggUsername}
				id="bggUsername"
				name="bggUsername"
				placeholder="Your BGG Username"
				type="text"
				startAdornment={
					<InputAdornment position="start">
						{bggUsername.length > 3 ? (
							<LibraryBooksOutlinedIcon />
						) : (
							<LibraryBooksOutlinedIcon color="disabled" />
						)}
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment position="end">
						{bggUsername.length > 0 && (
							<IconButton onClick={() => setBggUsername('')}>
								<ClearIcon color="disabled" />
							</IconButton>
						)}
					</InputAdornment>
				}
				fullWidth
			/>
		</Paper>
	)
}

export default CollectionFetchBox
