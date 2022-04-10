// @ Modules
import React from 'react'

// @ Icons
import LaunchIcon from '@mui/icons-material/Launch'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'

// @ Main
const ExtLinkIconBtn = ({ url, tooltip = 'See on BGG' }) => {
	return (
		<CustomTooltip title={tooltip}>
			<CustomIconBtn href={url} target="_blank" rel="noreferrer" variant="contained" color="primary" size="large">
				<LaunchIcon />
			</CustomIconBtn>
		</CustomTooltip>
	)
}

export default ExtLinkIconBtn
