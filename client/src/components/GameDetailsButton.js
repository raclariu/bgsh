// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@material-ui/icons/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ altId }) => {
	return (
		<Tooltip disableFocusListener title="Details">
			<IconButton component={RouterLink} to={{ pathname: `/games/${altId}` }} color="primary">
				<CenterFocusWeakTwoToneIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	)
}

export default GameDetailsButton
