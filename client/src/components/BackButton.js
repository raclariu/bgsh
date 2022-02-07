// @ Libraries
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

// @ Mui
import IconButton from '@mui/material/IconButton'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// @ Main
const BackButton = () => {
	const history = useHistory()

	return (
		<Fragment>
			<IconButton onClick={() => history.goBack()} color="primary">
				<ArrowBackIcon />
			</IconButton>
		</Fragment>
	)
}

export default BackButton
