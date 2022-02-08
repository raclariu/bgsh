// @ Libraries
import React from 'react'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

// @ Components
import CustomDivider from '../CustomDivider'

// @ Main
const GameCardSkeleton = () => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				bgcolor="background.paper"
				boxShadow={1}
				borderRadius="4px"
			>
				<Skeleton animation="wave" variant="rectangular" width={200} height={180} sx={{ my: 1 }} />

				<CustomDivider flexItem />

				<Box display="flex" justifyContent="center" alignItems="center" height="80px">
					<Skeleton animation="wave" variant="text" width={220} height={25} />
				</Box>

				<CustomDivider flexItem />

				<Box height={60} width="90%" display="flex" justifyContent="center" alignItems="center">
					<Skeleton animation="wave" variant="text" width="100%" height={25} />
				</Box>
			</Box>
		</Grid>
	)
}

export default GameCardSkeleton
