// @ Modules
import React from 'react'

// @ Mui
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

// @ Styles
const StyledTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor : '#403f3f',
		color           : 'rgba(255, 255, 255, 0.87)',
		boxShadow       : theme.shadows[1],
		fontSize        : 12,
		borderRadius    : '16px'
	}
}))

// @ Main
const CustomTooltip = ({ title, children }) => {
	return (
		<StyledTooltip disableFocusListener title={title}>
			<span>{children}</span>
		</StyledTooltip>
	)
}

export default CustomTooltip
