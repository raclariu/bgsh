// @ Modules
import React, { useState } from 'react'

// @ Mui
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

// @ Components
import CustomIconBtn from './CustomIconBtn'

// @ Main
const SearchBox = ({ placeholder, handleFilters }) => {
	const [ keyword, setKeyword ] = useState('')

	const submitSearchHandler = (e) => {
		e.preventDefault()

		if (keyword.trim().length > 2) {
			handleFilters(keyword, 'search')
		}
	}

	return (
		<Paper
			component="form"
			sx={{
				padding : (theme) => theme.spacing(1.2, 1.5, 1.2, 1.5)
			}}
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
						{keyword.trim().length > 2 ? (
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
