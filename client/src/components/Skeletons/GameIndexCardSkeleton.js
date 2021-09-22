// @ Libraries
import React from 'react'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import Divider from '@material-ui/core/Divider'

// @ Main
const GameIndexCardSkeleton = () => {
	return (
		<Grid item md={4} sm={6} xs={12}>
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
						<Skeleton animation="wave" variant="rect" width={180} height={180} />
					</Box>

					<Box display="flex" justifyContent="center" alignItems="center" mb={1}>
						<Box>
							<Skeleton animation="wave" variant="rect" width={45} height={36} />
						</Box>
						<Box ml={1}>
							<Skeleton animation="wave" variant="rect" width={45} height={36} />
						</Box>
						<Box ml={1}>
							<Skeleton animation="wave" variant="rect" width={45} height={36} />
						</Box>
					</Box>
				</Box>

				<Box width="100%">
					<Divider />
				</Box>

				<Box height={66} display="flex" justifyContent="center" alignItems="center">
					<Skeleton animation="wave" variant="text" width={200} />
				</Box>

				<Box width="100%">
					<Divider />
				</Box>

				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={1}>
					<Box>
						<Skeleton animation="wave" variant="text" width={200} height={30} />
					</Box>
					<Box>
						<Skeleton animation="wave" variant="text" width={150} height={30} />
					</Box>
					<Box>
						<Skeleton animation="wave" variant="text" width={75} height={30} />
					</Box>
				</Box>

				<Box width="100%">
					<Divider />
				</Box>

				<Box display="flex" width="95%" justifyContent="space-between" alignItems="center" height={60}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Skeleton animation="wave" variant="circle" width={32} height={32} />
						<Box ml={1}>
							<Skeleton animation="wave" variant="text" width={100} />
						</Box>
					</Box>
					<Box mr={2}>
						<Skeleton animation="wave" variant="rect" width={20} height={20} />
					</Box>
				</Box>
			</Box>
		</Grid>
	)
}

export default GameIndexCardSkeleton