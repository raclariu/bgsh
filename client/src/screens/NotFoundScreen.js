// @ Modules
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

// @ Mui
import Box from '@mui/material/Box'

// @ Components
import CustomButton from '../components/CustomButton'
import Helmet from '../components/Helmet'

// @ Main
const NotFoundScreen = () => {
	return (
		<Fragment>
			<Helmet title="Page not found" />

			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				bgcolor="background.paper"
				borderRadius="8px"
				boxShadow={2}
				width="100%"
				height={300}
				mb={3}
			>
				<Box fontSize={30} my={3}>
					Page not found
				</Box>
				<Box>Go to</Box>
				<Box display="flex" justifyContent="center" alignItems="center" width="100%">
					<CustomButton component={Link} to="/" variant="contained">
						Home
					</CustomButton>
				</Box>
			</Box>
		</Fragment>
	)
}

export default NotFoundScreen
