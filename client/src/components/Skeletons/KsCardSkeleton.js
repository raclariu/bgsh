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
			<Box height={296} display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" flexDirection="column" height={150} gap={1} width="100%">
					<CustomSkeleton variant="rectangle" width="100%" height="100%" />
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

				<Box height={64} display="flex" justifyContent="flex-end" alignItems="center" width="100%">
					<CustomSkeleton variant="retangle" width={40} sx={{ borderRadius: 1, mr: 2 }} />
				</Box>
			</Box>
		</Card>
	)
}

export default GeneralCardSkeleton
