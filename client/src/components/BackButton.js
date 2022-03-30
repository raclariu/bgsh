// @ Modules
import React, { Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// @ Components
import CustomIconBtn from './CustomIconBtn'

// @ Main
const BackButton = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	return (
		<Fragment>
			<CustomIconBtn onClick={() => navigate(pathname)} color="primary" edge="start">
				<ArrowBackIcon />
			</CustomIconBtn>
		</Fragment>
	)
}

export default BackButton
