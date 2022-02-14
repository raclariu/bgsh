// @ Libraries
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
		<Card elevation={1}>
			<Box height={338} display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" flexDirection="column" height={196} gap={1} p={1}>
					<CustomSkeleton animation="wave" variant="rectangle" width={175} height="100%" />
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

				<Box height={60} display="flex" justifyContent="flex-end" alignItems="center" width="100%">
					<CustomSkeleton animation="wave" variant="retangle" width={40} sx={{ borderRadius: 1, mr: 2 }} />
				</Box>
			</Box>
		</Card>
	)
}

export default GeneralCardSkeleton