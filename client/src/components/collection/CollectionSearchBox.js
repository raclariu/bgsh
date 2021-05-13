import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles((theme) => ({
	paper : {
		padding : theme.spacing(1.2, 1, 1.2, 2)
	}
}))

const CollectionSearchBox = () => {
	const cls = useStyles()
	const history = useHistory()

	const [ keyword, setKeyword ] = useState('')

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	const submitSearchHandler = (e) => {
		e.preventDefault()

		if (userInfo) {
			if (keyword.trim().length > 2) {
				history.push(`/collection?search=${keyword.trim()}&page=1`)
			}
		} else {
			history.push('/signin')
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
				placeholder="Search Collection"
				type="text"
				endAdornment={
					<InputAdornment position="end">
						{keyword ? (
							<IconButton onClick={() => setKeyword('')}>
								<ClearIcon color="disabled" />
							</IconButton>
						) : (
							<IconButton>
								<SearchIcon color="disabled" />
							</IconButton>
						)}
					</InputAdornment>
				}
				fullWidth
			/>
		</Paper>
	)
}

export default CollectionSearchBox
