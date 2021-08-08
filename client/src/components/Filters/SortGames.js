// @ Libraries
import React from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'

// @ Mui
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

// @ Styles
const useStyles = makeStyles((theme) => ({
	formControl : {
		margin   : theme.spacing(1),
		minWidth : 150
	}
}))

// @ Main
const SortGames = ({ handleFilters }) => {
	const cls = useStyles()
	const location = useLocation()

	return (
		<FormControl className={cls.formControl}>
			<InputLabel>Sort by</InputLabel>
			{location.pathname === '/games' && (
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
					<MenuItem value="new">Added Newest</MenuItem>
					<MenuItem value="old">Added Oldest</MenuItem>
					<MenuItem value="price-low">Lowest Price</MenuItem>
					<MenuItem value="price-high">Highest Price</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release Newest</MenuItem>
				</Select>
			)}

			{location.pathname === '/trades' && (
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
					<MenuItem value="new">Added Newest</MenuItem>
					<MenuItem value="old">Added Oldest</MenuItem>
					<MenuItem value="rank">Rank</MenuItem>
					<MenuItem value="year">Release Newest</MenuItem>
				</Select>
			)}
		</FormControl>
	)
}

export default SortGames
