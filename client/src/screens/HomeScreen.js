// @ Modules
import React, { Fragment } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

// @ Components
import Helmet from '../components/Helmet'

// @ Main
const HomeScreen = () => {
	return (
		<Fragment>
			<Helmet title="Homepage" />

			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				sx={{ lineHeight: 1 }}
				width="100%"
				textAlign="center"
			>
				<Box fontSize="h2.fontSize" fontWeight="fontWeightBold">
					Sell
				</Box>
				<Box fontSize="h2.fontSize" fontWeight="fontWeightBold">
					Trade
				</Box>
				<Box fontSize="h2.fontSize" fontWeight="fontWeightBold">
					Board games
				</Box>
			</Box>

			<Box display="flex" alignItems="center" justifyContent="center" mt={10} gap={2}>
				<Button
					component={RouterLink}
					to="/create-account"
					sx={{ width: 160 }}
					variant="contained"
					color="primary"
				>
					Create account
				</Button>
				<Button component={RouterLink} to="/login" sx={{ width: 160 }} variant="contained" color="secondary">
					Login
				</Button>
			</Box>

			<Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={10}>
				<Box p={15} borderRadius={2} boxShadow={4} bgcolor="background.paper">
					<Box />
				</Box>
				<Box p={15} borderRadius={2} boxShadow={4} bgcolor="background.paper">
					<Box />
				</Box>
				<Box p={15} borderRadius={2} boxShadow={4} bgcolor="background.paper">
					<Box />
				</Box>
			</Box>
		</Fragment>
	)
}

export default HomeScreen
