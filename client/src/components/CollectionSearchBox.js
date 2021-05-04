import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
	button : {
		marginTop : theme.spacing(1)
	}
}))

const CollectionSearchBox = () => {
	const classes = useStyles()

	const history = useHistory()

	const [ keyword, setKeyword ] = useState('')

	const submitSearchHandler = (e) => {
		e.preventDefault()

		history.push(`/collection?search=${keyword}&page=1`)
	}

	return (
		<form>
			<Grid item>
				<TextField
					onChange={(e) => setKeyword(e.target.value)}
					value={keyword}
					variant="outlined"
					id="keyword"
					label="Search for a game"
					type="text"
					fullWidth
				/>
			</Grid>
			<Grid item>
				<Button
					className={classes.button}
					onClick={submitSearchHandler}
					disabled={keyword.length < 3}
					type="submit"
					variant="contained"
					color="secondary"
					size="large"
					fullWidth
				>
					Search
				</Button>
			</Grid>
		</form>
	)
}

export default CollectionSearchBox
