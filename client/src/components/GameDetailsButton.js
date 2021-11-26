// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import IconButton from '@material-ui/core/IconButton'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ altId }) => {
	return (
		<CustomTooltip title="Details">
			<span>
				<IconButton component={RouterLink} to={{ pathname: `/games/${altId}` }} color="primary">
					<CenterFocusWeakTwoToneIcon fontSize="small" />
				</IconButton>
			</span>
		</CustomTooltip>
	)
}

export default GameDetailsButton
