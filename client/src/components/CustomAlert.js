// @ Libraries
import React from 'react'

// @ Mui
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// @ Main
const CustomAlert = ({ severity, children }) => {
	return (
		<Box borderRadius="4px">
			<Alert variant="outlined" severity={severity}>
				{children}
			</Alert>
		</Box>
	)
}

// @ Default Props
CustomAlert.defaultProps = {
	severity : 'error',
	children : 'Error occured. Try again.'
}

export default CustomAlert
