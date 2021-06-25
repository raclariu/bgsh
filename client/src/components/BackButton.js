import React, { Fragment } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import KeyboardBackspaceTwoToneIcon from '@material-ui/icons/KeyboardBackspaceTwoTone'

const BackButton = () => {
	const location = useLocation()

	return (
		<Fragment>
			<IconButton component={RouterLink} to={location.pathname}>
				<KeyboardBackspaceTwoToneIcon color="primary" />
			</IconButton>
		</Fragment>
	)
}

export default BackButton
