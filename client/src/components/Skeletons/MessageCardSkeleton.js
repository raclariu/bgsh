// @ Libraries
import React from 'react'

// @ Mui
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../CustomDivider'
import CustomSkeleton from './CustomSkeleton'

// @ Main
const MessageCardSkeleton = () => {
	return (
		<Card elevation={1}>
			<Box height={137} display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" justifyContent="flex-start" height={80} gap={1} p={2} width="100%">
					<CustomSkeleton animation="wave" variant="circular" width={48} height={48} />
					<Box display="flex" flexDirection="column">
						<CustomSkeleton animation="wave" variant="text" width={100} />
						<Box display="flex" gap={1}>
							<CustomSkeleton animation="wave" variant="text" width={120} />
							<CustomSkeleton animation="wave" variant="text" width={100} />
						</Box>
					</Box>
				</Box>

				<CustomDivider flexItem />

				<Box display="flex" height={56} justifyContent="space-between" alignItems="center" width="100%" p={2}>
					<CustomSkeleton animation="wave" variant="rectangle" width={20} />
					<CustomSkeleton animation="wave" variant="rectangle" width={20} />
				</Box>
			</Box>
		</Card>
	)
}

export default MessageCardSkeleton
