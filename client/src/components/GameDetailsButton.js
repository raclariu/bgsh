// @ Modules
import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomTooltip from './CustomTooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ slug }) => {
	return (
		<CustomTooltip title="Details">
			<CustomIconBtn component={RouterLink} to={slug} color="primary" size="large">
				<CenterFocusWeakTwoToneIcon />
			</CustomIconBtn>
		</CustomTooltip>
	)
}

export default GameDetailsButton
