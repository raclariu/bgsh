// @ Modules
import React, { useState } from 'react'

// @ Mui
import Box from '@mui/material/Box'

// @ Components
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { useBggFetchCollectionMutation } from '../hooks/hooks'

// @ Main
const CollectionFetchBox = () => {
	const [ bggUsername, setBggUsername ] = useState('')

	const mutation = useBggFetchCollectionMutation()

	const submitToBGGHandler = (e) => {
		e.preventDefault()
		if (bggUsername.trim().length > 3) {
			mutation.mutate(bggUsername)
		}
	}

	return (
		<form onSubmit={submitToBGGHandler} autoComplete="off">
			<Input
				onChange={(inputVal) => setBggUsername(inputVal)}
				value={bggUsername}
				error={mutation.isError ? true : false}
				helperText={mutation.isError ? mutation.error.response.data.message : false}
				size="medium"
				id="bggUsername"
				name="bggUsername"
				label="Import your BoardGameGeek collection"
				placeholder="Enter your BoardGameGeek username"
				type="text"
				fullWidth
			/>

			<Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
				<LoadingBtn
					type="submit"
					variant="contained"
					disabled={mutation.isLoading || bggUsername.trim().length < 4}
					color="primary"
					loading={mutation.isLoading}
				>
					Import collection
				</LoadingBtn>
			</Box>
		</form>
	)
}

export default CollectionFetchBox
