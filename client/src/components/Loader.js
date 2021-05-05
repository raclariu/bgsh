import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
	root : {
		display        : 'flex',
		justifyContent : 'center'
	}
}))

const Loader = ({ size, color }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<CircularProgress size={size} color={color} />
		</div>
	)
}

export default Loader
