import React, { Fragment } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const BackButton = () => {
	const location = useLocation()
	console.log(location)

	return (
		<Fragment>
			<IconButton component={RouterLink} to={location.pathname}>
				<ArrowBackIcon />
			</IconButton>
		</Fragment>
	)
}

export default BackButton
