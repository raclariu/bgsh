// @ Libraries
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import CircularProgress from '@material-ui/core/CircularProgress'

// @ Styles
const useStyles = makeStyles((theme) => ({
	root : {
		display        : 'flex',
		justifyContent : 'center'
	}
}))

// @ Main
const Loader = ({ size, color }) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<CircularProgress size={size} color={color} />
		</div>
	)
}

// @ Default Props
Loader.defaultProps = {
	size  : 40,
	color : 'primary'
}

export default Loader
