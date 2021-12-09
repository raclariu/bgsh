// @ Libraries
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

// @ Mui

// @ Main
const CustomTooltip = ({ title, children }) => {
	return (
		<Tooltip disableFocusListener title={title}>
			<span>{children}</span>
		</Tooltip>
	)
}

export default CustomTooltip
