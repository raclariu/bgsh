// @ Modules
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

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
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
				<Box display="flex" alignItems="center" gap={1} mt={2}>
					<img src="/meeples48.png" style={{ height: 24, width: 24, marginBottom: '4px' }} alt="logo" />
					<Typography variant="body1" fontWeight="fontWeightMedium" color="grey.500">
						Meeples.ro • 2022
					</Typography>
				</Box>
				<Link fontSize="caption.fontSize" color="grey.500" component={RouterLink} to="/changelog">
					changelog
				</Link>
			</Box>
		</Box>
	)
}

export default Footer
