// @ Libraries
import React from 'react'

// @ Mui
import Box from '@material-ui/core/Box'

// @ Styles
const defaultBox = {
	display        : 'flex',
	flexDirection  : 'column',
	alignItems     : 'center',
	justifyContent : 'center',
	boxShadow      : 2,
	p              : 1,
	borderRadius   : 4,
	bgcolor        : 'background.paper'
}

// @ Main
const InfoBox = ({ data, children }) => {
	return (
		<Box {...defaultBox}>
			<Box>{children}</Box>
			<Box textAlign="center">{data}</Box>
		</Box>
	)
}

export default InfoBox
