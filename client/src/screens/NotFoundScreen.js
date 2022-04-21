// @ Modules
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

// @ Mui
import Paper from '@mui/material/Paper'
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
				component={Paper}
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				borderRadius="4px"
				boxShadow={1}
				width="100%"
				height={300}
				gap={3}
				mt={10}
			>
				<Box fontSize="h3.fontSize">404</Box>
				<Box fontSize="h4.fontSize">Page not found</Box>
				<Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={2}>
					<CustomButton component={Link} to="/" variant="contained">
						Home
					</CustomButton>
					<CustomButton component={Link} to="/dashboard" variant="contained">
						Dashboard
					</CustomButton>
				</Box>
			</Box>
		</Fragment>
	)
}

export default NotFoundScreen
