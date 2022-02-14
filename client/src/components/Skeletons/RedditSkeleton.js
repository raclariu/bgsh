// @ Libraries
import React from 'react'

// @ Mui
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

// @ Components
import CustomSkeleton from './CustomSkeleton'

const RedditSkeleton = () => {
	return (
		<Paper
			sx={{
				display      : 'flex',
				boxShadow    : 1,
				borderRadius : 1,
				p            : 1,
				width        : '100%',
				height       : '116px',
				gap          : 1
			}}
		>
			<CustomSkeleton animation="wave" variant="rectangle" width={180} height={100} sx={{ borderRadius: 1 }} />
			<Box display="flex" flexDirection="column" width="100%" ml={1}>
				<CustomSkeleton animation="wave" variant="text" width="90%" />
				<CustomSkeleton animation="wave" variant="text" width="75%" />
				<CustomSkeleton animation="wave" variant="text" width="60%" />
			</Box>
		</Paper>
	)
}

export default RedditSkeleton
