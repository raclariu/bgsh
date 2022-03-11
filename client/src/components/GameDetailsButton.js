// @ Modules
import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomTooltip from './CustomTooltip'

// @ Icons
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone'

// @ Main
const GameDetailsButton = ({ altId, mode }) => {
	return (
		<Fragment>
			{mode !== 'want' && (
				<CustomTooltip title="Details">
					<CustomIconBtn
						component={RouterLink}
						to={mode === 'sell' ? `/sales/${altId}` : `/trades/${altId}`}
						color="primary"
						size="large"
					>
						<CenterFocusWeakTwoToneIcon fontSize="small" />
					</CustomIconBtn>
				</CustomTooltip>
			)}
		</Fragment>
	)
}

export default GameDetailsButton
