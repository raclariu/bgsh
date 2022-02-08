// @ Libraries
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

// @ Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// @ Components
import CustomIconBtn from './CustomIconBtn'

// @ Main
const BackButton = () => {
	const history = useHistory()

	return (
		<Fragment>
			<CustomIconBtn onClick={() => history.goBack()} color="primary" edge="start">
				<ArrowBackIcon />
			</CustomIconBtn>
		</Fragment>
	)
}

export default BackButton
