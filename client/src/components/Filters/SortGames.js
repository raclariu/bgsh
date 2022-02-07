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

// @ Main
const SortGames = ({ handleFilters, mode }) => {
	const location = useLocation()

	return (
		<FormControl variant="standard" sx={{ margin: (theme) => theme.spacing(2), minWidth: 130 }}>
			<InputLabel>Sort by</InputLabel>
			{mode === 'sell' && (
				<Select
					MenuProps={{
						anchorOrigin    : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin : {
							vertical   : 'top',
							horizontal : 'left'
						}
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Newest</MenuItem>
					<MenuItem value="old">Oldest</MenuItem>
					<MenuItem value="price-low">Lowest price</MenuItem>
					<MenuItem value="price-high">Highest price</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}

			{mode === 'trade' && (
				<Select
					MenuProps={{
						anchorOrigin    : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin : {
							vertical   : 'top',
							horizontal : 'left'
						}
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Newest</MenuItem>
					<MenuItem value="old">Oldest</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}

			{mode === 'want' && (
				<Select
					MenuProps={{
						anchorOrigin    : {
							vertical   : 'bottom',
							horizontal : 'left'
						},
						transformOrigin : {
							vertical   : 'top',
							horizontal : 'left'
						}
					}}
					value={queryString.parse(location.search).sort || 'new'}
					onChange={(e) => handleFilters(e.target.value, 'sort')}
				>
					<MenuItem value="new">Newest</MenuItem>
					<MenuItem value="old">Oldest</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release date</MenuItem>
				</Select>
			)}
		</FormControl>
	)
}

export default SortGames
