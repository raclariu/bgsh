// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomTooltip from './CustomTooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ altId }) => {
	return (
		<CustomTooltip title="Details">
			<CustomIconBtn component={RouterLink} to={{ pathname: `/games/${altId}` }} color="primary" size="large">
				<CenterFocusWeakTwoToneIcon fontSize="small" />
			</CustomIconBtn>
		</CustomTooltip>
	)
}

export default GameDetailsButton
