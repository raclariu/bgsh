// @ Modules
import React from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

// @ Components
import CustomSkeleton from './CustomSkeleton'
import CustomDivider from '../CustomDivider'

// @ Main
const GameIndexCardSkeleton = ({ mode = 'sell' }) => {
	return (
		<Card elevation={2}>
			<Box
				height={mode === 'sell' ? 508 : mode === 'trade' ? 472 : 492}
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Box display="flex" flexDirection="column" height={241} gap={1} p={1}>
					<CustomSkeleton variant="rectangle" width={175} height="100%" />
					<Box display="flex" justifyContent="center" gap={1} height={37} width="100%">
						<CustomSkeleton variant="rectangle" width={45} height={37} sx={{ borderRadius: '4px' }} />
						<CustomSkeleton variant="rectangle" width={45} height={37} sx={{ borderRadius: '4px' }} />
						<CustomSkeleton variant="rectangle" width={45} height={37} sx={{ borderRadius: '4px' }} />
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
					<CustomSkeleton variant="text" width={180} />
					<CustomSkeleton variant="text" width={100} />
				</Box>

				<CustomDivider flexItem />

				<Box
					height={mode === 'sell' ? 120 : mode === 'trade' ? 84 : 112}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					width="100%"
					gap={0.5}
				>
					<CustomSkeleton variant="rectangle" width={150} height={24} sx={{ borderRadius: 4 }} />
					<CustomSkeleton variant="rectangle" width={210} height={24} sx={{ borderRadius: 4 }} />
					{mode === 'sell' && (
						<CustomSkeleton variant="rectangle" width={70} height={32} sx={{ borderRadius: 4 }} />
					)}

					{mode === 'want' && (
						<CustomSkeleton variant="rectangle" width={160} height={24} sx={{ borderRadius: 4 }} />
					)}
				</Box>

				<CustomDivider flexItem />

				<Box display="flex" justifyContent="center" width="100%" alignItems="center" height={64} gap={1}>
					<CustomSkeleton variant="text" width="75%" />
				</Box>
			</Box>
		</Card>
	)
}

export default GameIndexCardSkeleton
