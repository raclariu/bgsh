// @ Modules
import React from 'react'

// @ Mui
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../CustomDivider'
import CustomSkeleton from './CustomSkeleton'

// @ Main
const CrowdfundingCardSkeleton = () => {
	return (
		<Card elevation={2}>
			<Box height={374} display="flex" flexDirection="column" alignItems="center">
				<Box
					height={74}
					p={2}
					display="flex"
					justifyContent="center"
					alignItems="flex-start"
					flexDirection="column"
					width="100%"
				>
					<CustomSkeleton variant="text" width={180} />
					<CustomSkeleton variant="text" width={100} />
				</Box>

				<CustomDivider />

				<Box display="flex" flexDirection="column" height={162} gap={1} width="100%">
					<CustomSkeleton variant="rectangle" width="100%" height="100%" />
				</Box>

				<CustomDivider />

				<Box
					height={136}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					width="100%"
					gap={1}
				>
					<CustomSkeleton variant="text" height={28} width={180} />
					<CustomSkeleton variant="text" height={28} width={100} />
					<CustomSkeleton variant="text" height={28} width={200} />
				</Box>
			</Box>
		</Card>
	)
}

export default CrowdfundingCardSkeleton
