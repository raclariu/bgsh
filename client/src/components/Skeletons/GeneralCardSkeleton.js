// @ Modules
import React from 'react'

// @ Mui
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../CustomDivider'
import CustomSkeleton from './CustomSkeleton'

// @ Main
const GeneralCardSkeleton = () => {
	return (
		<Card elevation={2}>
			<Box height={342} display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" flexDirection="column" height={196} gap={1} p={1}>
					<CustomSkeleton variant="rectangle" width={175} height="100%" />
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

				<Box display="flex" justifyContent="center" width="100%" alignItems="center" height={64} gap={1}>
					<CustomSkeleton variant="text" width="75%" />
				</Box>
			</Box>
		</Card>
	)
}

export default GeneralCardSkeleton
