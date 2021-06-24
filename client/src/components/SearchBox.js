import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles((theme) => ({
	paper : {
		padding : theme.spacing(1.2, 1.5, 1.2, 1.5)
	}
}))

const SearchBox = ({ placeholder }) => {
	const cls = useStyles()
	const history = useHistory()
	const location = useLocation()

	const [ keyword, setKeyword ] = useState('')

	const submitSearchHandler = (e) => {
		e.preventDefault()

		if (keyword.trim().length > 2) {
			history.push(`${location.pathname}?search=${keyword.trim()}&page=1`)
		}
	}

	return (
		<Paper
			component="form"
			className={cls.paper}
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
