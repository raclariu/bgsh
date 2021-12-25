// @ Libraries
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import IconButton from '@mui/material/IconButton'

// @ Components
import CustomTooltip from './CustomTooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ altId }) => {
	return (
        <CustomTooltip title="Details">
			<IconButton
                component={RouterLink}
                to={{ pathname: `/games/${altId}` }}
                color="primary"
                size="large">
				<CenterFocusWeakTwoToneIcon fontSize="small" />
			</IconButton>
		</CustomTooltip>
    );
}

export default GameDetailsButton
