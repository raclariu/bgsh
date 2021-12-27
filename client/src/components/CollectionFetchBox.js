// @ Libraries
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// @ Components
import Loader from './Loader'
import Input from './Input'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { clearSaleList } from '../actions/saleListActions'
import { apiFetchBggCollection } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const CollectionFetchBox = () => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ bggUsername, setBggUsername ] = useState('')
	const [ showSnackbar ] = useNotification()

	const mutation = useMutation((bggUsername) => apiFetchBggCollection(bggUsername), {
		onSuccess : () => {
			queryClient.invalidateQueries([ 'collection' ])
			queryClient.invalidateQueries([ 'wishlist' ])
			dispatch(clearSaleList())
			showSnackbar.info({
				text : 'Your list was cleared'
			})
			showSnackbar.success({
				text : `Collection data from BGG for user ${bggUsername} was successfully fetched`
			})
		}
	})

	const submitToBGGHandler = (e) => {
		e.preventDefault()
		if (bggUsername.trim().length > 3) {
			mutation.mutate(bggUsername)
		}
	}

	return (
		<form onSubmit={submitToBGGHandler} autoComplete="off">
			<Box fontWeight="fontWeightMedium">Import your BoardGameGeek collection</Box>
			<Box color="grey.500" mb={2} fontStyle="italic" fontSize="caption.fontSize">
				Warning: Your sale/trade/wanted list will reset
			</Box>

			<Input
				onChange={(e) => setBggUsername(e.target.value)}
				value={bggUsername}
				error={mutation.isError ? true : false}
				helperText={mutation.isError ? mutation.error.response.data.message : false}
				size="medium"
				id="bggUsername"
				name="bggUsername"
				label="Import collection"
				placeholder="Enter your boardgamegeek username"
				type="text"
				InputProps={{
					endAdornment : (
						<Fragment>{mutation.isLoading ? <Loader color="secondary" size={20} /> : null}</Fragment>
					)
				}}
				fullWidth
			/>

			<Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
				<Button
					type="submit"
					variant="contained"
					disabled={mutation.isLoading || bggUsername.trim().length < 4}
					color="primary"
				>
					Import collection
				</Button>
			</Box>
		</form>
	)
}

export default CollectionFetchBox
