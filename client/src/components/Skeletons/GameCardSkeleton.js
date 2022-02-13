// @ Libraries
import React from 'react'

// @ Mui
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

// @ Components
import CustomSkeleton from './CustomSkeleton'
import CustomDivider from '../CustomDivider'

// @ Main
const GameCardSkeleton = () => {
	return (
		<Card elevation={1}>
			<Box height={478} display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" flexDirection="column" height={241} gap={1} p={1}>
					<CustomSkeleton animation="wave" variant="rectangle" width={175} height="100%" />
					<Box display="flex" justifyContent="center" gap={1} height={37} width="100%">
						<CustomSkeleton
							animation="wave"
							variant="rectangle"
							width={45}
							height={37}
							sx={{ borderRadius: 2 }}
						/>
						<CustomSkeleton
							animation="wave"
							variant="rectangle"
							width={45}
							height={37}
							sx={{ borderRadius: 2 }}
						/>
					</Box>
				</Box>

				<CustomDivider flexItem />

				<Box
					height={80}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					width="100%"
				>
					<CustomSkeleton animation="wave" variant="text" width={180} />
					<CustomSkeleton animation="wave" variant="text" width={100} />
				</Box>

				<CustomDivider flexItem />

				<Box
					height={96}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					width="100%"
					gap={0.5}
				>
					<CustomSkeleton
						animation="wave"
						variant="rectangle"
						width={85}
						sx={{ borderRadius: 4, height: 24 }}
					/>
					<CustomSkeleton
						animation="wave"
						variant="rectangle"
						width={190}
						sx={{ borderRadius: 4, height: 24 }}
					/>
				</Box>

				<CustomDivider flexItem />

				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					height={58}
					gap={1}
					p={2}
					width="100%"
				>
					<CustomSkeleton animation="wave" variant="retangle" width={40} sx={{ borderRadius: 1 }} />
					<CustomSkeleton animation="wave" variant="retangle" width={24} sx={{ borderRadius: 1 }} />
				</Box>
			</Box>
		</Card>
	)
}

export default GameCardSkeleton
