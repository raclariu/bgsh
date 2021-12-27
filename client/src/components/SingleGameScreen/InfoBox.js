// @ Libraries
import React from 'react'

// @ Mui
import Box from '@mui/material/Box'

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
		<Box sx={defaultBox}>
			<Box>{children}</Box>
			<Box textAlign="center" fontSize={12}>
				{data}
			</Box>
		</Box>
	)
}

export default InfoBox
