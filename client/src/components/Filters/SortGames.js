// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const PREFIX = 'SortGames'

const classes = {
	formControl : `${PREFIX}-formControl`
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
	[`&.${classes.formControl}`]: {
		margin   : theme.spacing(1),
		minWidth : 150
	}
}))

// @ Main
const SortGames = ({ handleFilters, mode }) => {
	const location = useLocation()

	return (
		<StyledFormControl variant="standard" className={classes.formControl}>
			<InputLabel>Sort by</InputLabel>
			{mode === 'sell' && (
				<Select
					MenuProps={{
						anchorOrigin       : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin    : {
							vertical   : 'top',
							horizontal : 'left'
						},
						getContentAnchorEl : null
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Added newest</MenuItem>
					<MenuItem value="old">Added oldest</MenuItem>
					<MenuItem value="price-low">Lowest price</MenuItem>
					<MenuItem value="price-high">Highest price</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}

			{mode === 'trade' && (
				<Select
					MenuProps={{
						anchorOrigin       : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin    : {
							vertical   : 'top',
							horizontal : 'left'
						},
						getContentAnchorEl : null
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Added newest</MenuItem>
					<MenuItem value="old">Added oldest</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}

			{mode === 'want' && (
				<Select
					MenuProps={{
						anchorOrigin       : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin    : {
							vertical   : 'top',
							horizontal : 'left'
						},
						getContentAnchorEl : null
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Added newest</MenuItem>
					<MenuItem value="old">Added oldest</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}
		</StyledFormControl>
	)
}

export default SortGames
