// @ Libraries
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

// @ Mui

// @ Main
const CustomTooltip = ({ title, children }) => {
	return (
		<Tooltip disableFocusListener title={title}>
			{children}
		</Tooltip>
	)
}

export default CustomTooltip
