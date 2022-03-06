// @ Modules
import React, { Fragment } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// @ Components
import CustomIconBtn from './CustomIconBtn'

// @ Main
const BackButton = () => {
	const history = useHistory()
	const { pathname } = useLocation()

	return (
		<Fragment>
			<CustomIconBtn onClick={() => history.push(pathname)} color="primary" edge="start">
				<ArrowBackIcon />
			</CustomIconBtn>
		</Fragment>
	)
}

export default BackButton
