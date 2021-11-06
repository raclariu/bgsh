// @ Libraries
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Mui
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

// @ Components
import Loader from './Loader'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { bggGetCollection } from '../actions/collectionActions'
import { BGG_COLLECTION_LIST_RESET } from '../constants/collectionConstants'

// @ Main
const CollectionFetchBox = () => {
	const dispatch = useDispatch()

	const [ bggUsername, setBggUsername ] = useState('')

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading, error, success } = bggCollection

	useEffect(
		() => {
			if (success) {
				setBggUsername('')
			}
		},
		[ success ]
	)

	useEffect(
		() => {
			return () => {
				dispatch({ type: BGG_COLLECTION_LIST_RESET })
			}
		},
		[ dispatch ]
	)

	const submitToBGGHandler = (e) => {
		e.preventDefault()
		if (bggUsername.trim().length > 3) {
			dispatch(bggGetCollection(bggUsername))
		}
	}

	return (
		<form onSubmit={submitToBGGHandler} autoComplete="off">
			{success && (
				<Box mb={2}>
					<CustomAlert severity="success">
						<Box>Collection successfully imported.</Box>
					</CustomAlert>
				</Box>
			)}

			<Box fontWeight="fontWeightMedium">Import your BoardGameGeek collection</Box>
			<Box color="grey.500" mb={2} fontStyle="italic" fontSize="caption.fontSize">
				Warning: Your sale/trade/wanted list will reset
			</Box>

			<TextField
				onChange={(e) => setBggUsername(e.target.value)}
				value={bggUsername}
				error={error ? true : false}
				helperText={error ? error : false}
				id="bggUsername"
				name="bggUsername"
				label="Import collection"
				placeholder="Enter your boardgamegeek username"
				type="text"
				variant="outlined"
				fullWidth
				InputProps={{
					endAdornment : <Fragment>{loading ? <Loader color="secondary" size={20} /> : null}</Fragment>
				}}
			/>

			<Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
				<Button
					type="submit"
					variant="contained"
					disabled={loading || bggUsername.trim().length < 4}
					color="primary"
				>
					Import collection
				</Button>
			</Box>
		</form>
	)
}

export default CollectionFetchBox
