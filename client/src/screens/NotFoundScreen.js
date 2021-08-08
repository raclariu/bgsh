// @ Libraries
import React from 'react'
import { Link } from 'react-router-dom'

// @ Mui
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

// @ Main
const NotFoundScreen = () => {
	return (
		<Box my={4}>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				bgcolor="background.paper"
				borderRadius={4}
				boxShadow={2}
				width="100%"
				height={300}
			>
				<Box fontSize={30} my={3}>
					Page not found
				</Box>
				<Box>Go to</Box>
				<Box display="flex" justifyContent="center" alignItems="center" width="100%">
					<Button component={Link} to="/" variant="contained" color="primary">
						Home
					</Button>
				</Box>
			</Box>
		</Box>
	)
}

export default NotFoundScreen
