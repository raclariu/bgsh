// @ Modules
import React from 'react'

// @ Mui
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// @ Main
const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				height         : '90px',
				p              : 1,
				borderStyle    : 'solid',
				borderColor    : (theme) => (theme.palette.mode === 'light' ? '#E7EBF0' : 'rgba(194, 224, 255, 0.08)'),
				borderWidth    : '0',
				borderTopWidth : 'thin'
			}}
		>
			<Box display="flex" alignItems="center" justifyContent="center" height="100%">
				<Typography variant="body1" fontWeight="fontWeightMedium" color="grey.500">
					Meeples.ro
				</Typography>
			</Box>
		</Box>
	)
}

export default Footer
