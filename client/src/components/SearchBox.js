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

const PREFIX = 'SearchBox'

const classes = {
	paper : `${PREFIX}-paper`
}

const StyledPaper = styled(Paper)(({ theme }) => ({
	[`&.${classes.paper}`]: {
		padding : theme.spacing(1.2, 1.5, 1.2, 1.5)
	}
}))

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
		<StyledPaper
			component="form"
			className={classes.paper}
			elevation={1}
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
							<IconButton onClick={() => setKeyword('')} size="large">
								<ClearIcon color="disabled" />
							</IconButton>
						)}
					</InputAdornment>
				}
				fullWidth
			/>
		</StyledPaper>
	)
}

export default SearchBox
