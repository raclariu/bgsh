// @ Libraries
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

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
				startAdornment={
					<InputAdornment position="start">
						{keyword.trim().length > 2 ? <SearchIcon /> : <SearchIcon color="disabled" />}
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment position="end">
						{keyword.length > 0 && (
							<IconButton onClick={() => setKeyword('')}>
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

export default SearchBox
