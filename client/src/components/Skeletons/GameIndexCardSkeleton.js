// @ Libraries
import React from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'

// @ Main
const GameIndexCardSkeleton = () => {
	return (
		<Grid item md={4} sm={6} xs={12} sx={{ width: '100%' }}>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				height={473}
				boxShadow={2}
				bgcolor="background.paper"
			>
				<Box height={240} width="100%">
					<Box display="flex" justifyContent="center" alignItems="center" my={1}>
						<Skeleton animation="wave" variant="rectangular" width={180} height={180} />
					</Box>

					<Box display="flex" justifyContent="center" alignItems="center" mb={1} gap={1}>
						<Skeleton animation="wave" variant="rectangular" width={45} height={36} />

						<Skeleton animation="wave" variant="rectangular" width={45} height={36} />

						<Skeleton animation="wave" variant="rectangular" width={45} height={36} />
					</Box>
				</Box>

				<Divider flexItem />

				<Box height={66} display="flex" justifyContent="center" alignItems="center">
					<Skeleton animation="wave" variant="text" width={200} />
				</Box>

				<Divider flexItem />

				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={1}>
					<Skeleton animation="wave" variant="text" width={200} height={30} />

					<Skeleton animation="wave" variant="text" width={150} height={30} />

					<Skeleton animation="wave" variant="text" width={75} height={30} />
				</Box>

				<Divider flexItem />

				<Box display="flex" width="95%" justifyContent="space-between" alignItems="center" height={60}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Skeleton animation="wave" variant="circular" width={32} height={32} />
						<Skeleton animation="wave" variant="text" width={100} sx={{ ml: 1 }} />
					</Box>

					<Skeleton animation="wave" variant="rectangular" width={20} height={20} sx={{ mr: 2 }} />
				</Box>
			</Box>
		</Grid>
	)
}

export default GameIndexCardSkeleton
