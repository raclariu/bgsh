// @ Modules
import React, { useState } from 'react'
import { useIsFetching } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

// @ Components
import Loader from './Loader'
import CustomIconBtn from './CustomIconBtn'

// @ Main
const SearchBox = ({ placeholder, handleFilters }) => {
	const [ keyword, setKeyword ] = useState('')

	const fetching = useIsFetching()

	const submitSearchHandler = (e) => {
		e.preventDefault()

		if (keyword.trim().length > 2) {
			handleFilters(keyword, 'search')
		}
	}

	return (
		<Paper
			component="form"
			sx={{ py: 1.5, px: 1 }}
			elevation={2}
			onSubmit={submitSearchHandler}
			noValidate
			autoComplete="off"
		>
			<InputBase
				onChange={(e) => setKeyword(e.target.value)}
				value={keyword}
				id="keyword"
				name="keyword"
				placeholder={placeholder}
				type="text"
				endAdornment={
					<InputAdornment position="end">
						{fetching ? (
							<Box display="flex" alignItems="center" mr={1}>
								<Loader size={20} />
							</Box>
						) : keyword.trim().length > 2 ? (
							<CustomIconBtn size="small" onClick={submitSearchHandler}>
								<SearchIcon color="primary" />
							</CustomIconBtn>
						) : (
							<CustomIconBtn size="small" disabled>
								<SearchIcon color="disabled" />
							</CustomIconBtn>
						)}
					</InputAdornment>
				}
				startAdornment={
					<InputAdornment position="start">
						{keyword.length > 0 ? (
							<CustomIconBtn size="small" onClick={() => setKeyword('')}>
								<ClearIcon />
							</CustomIconBtn>
						) : (
							<CustomIconBtn disabled size="small">
								<ClearIcon />
							</CustomIconBtn>
						)}
					</InputAdornment>
				}
				fullWidth
			/>
		</Paper>
	)
}

export default SearchBox
