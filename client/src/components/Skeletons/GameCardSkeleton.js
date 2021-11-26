// @ Libraries
import React from 'react'

// @ Components
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import Divider from '@material-ui/core/Divider'

// @ Main
const GameCardSkeleton = () => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				bgcolor="background.paper"
				boxShadow={2}
				borderRadius={4}
			>
				<Box my={1}>
					<Skeleton animation="wave" variant="rect" width={200} height={180} />
				</Box>

				<Divider style={{ width: '100%' }} />

				<Box display="flex" justifyContent="center" alignItems="center" height="80px">
					<Skeleton animation="wave" variant="text" width={220} height={25} />
				</Box>

				<Divider style={{ width: '100%' }} />

				<Box height={60} width="90%" display="flex" justifyContent="center" alignItems="center">
					<Skeleton animation="wave" variant="text" width="100%" height={25} />
				</Box>
			</Box>
		</Grid>
	)
}

export default GameCardSkeleton
