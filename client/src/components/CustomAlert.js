// @ Modules
import React from 'react'

// @ Mui
import Alert from '@mui/material/Alert'

// @ Main
const CustomAlert = ({ severity, children }) => {
	return (
		<Alert sx={{ borderRadius: '4px' }} variant="outlined" severity={severity}>
			{children}
		</Alert>
	)
}

// @ Default Props
CustomAlert.defaultProps = {
	severity : 'error',
	children : 'Error occured. Try again.'
}

export default CustomAlert
