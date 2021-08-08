// @ Libraries
import React from 'react'

// @ Mui
import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'

// @ Main
const Message = ({ severity, children }) => {
	return (
		<Box boxShadow={2} borderRadius={4}>
			<Alert variant="filled" severity={severity}>
				{children}
			</Alert>
		</Box>
	)
}

// @ Default Props
Message.defaultProps = {
	severity : 'error',
	children : 'Error occured. Try again.'
}

export default Message
