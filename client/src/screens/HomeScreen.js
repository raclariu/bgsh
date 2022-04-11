// @ Modules
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

// @ Components
import Helmet from '../components/Helmet'

// @ Main
const HomeScreen = () => {
	const { success } = useSelector((state) => state.userData)

	return (
		<Fragment>
			<Helmet title="Meeples.ro" />

			<Box
				sx={{ flex: 1 }}
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height="100%"
			>
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

				{!success && (
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
						<Button
							component={RouterLink}
							to="/login"
							sx={{ width: 160 }}
							variant="contained"
							color="secondary"
						>
							Login
						</Button>
					</Box>
				)}

				{success && (
					<Box display="flex" alignItems="center" justifyContent="center" mt={10} gap={2}>
						<Button
							component={RouterLink}
							to="/sales"
							sx={{ width: 160 }}
							variant="contained"
							color="primary"
						>
							For sale
						</Button>
						<Button
							component={RouterLink}
							to="/trades"
							sx={{ width: 160 }}
							variant="contained"
							color="secondary"
						>
							For trade
						</Button>
					</Box>
				)}
			</Box>
		</Fragment>
	)
}

export default HomeScreen
