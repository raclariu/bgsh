// @ Libraries
import React from 'react'

// @ Mui
import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'

// @ Main
const CustomAlert = ({ severity, children }) => {
	return (
		<Box borderRadius={4}>
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
