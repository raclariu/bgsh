// @ Modules
import React from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary">
			{'Copyright © '}
			<Link color="inherit" href="/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
		</Typography>
	)
}

// @ Main
export default function StickyFooter() {
	return (
		<Box
			component="footer"
			sx={{
				height          : '180px',
				padding         : (theme) => theme.spacing(8, 2),
				marginTop       : 'auto',
				backgroundColor : (theme) =>
					theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.paper
			}}
		>
			<Container maxWidth="sm">
				<Typography variant="body1">Footer Placeholder</Typography>
				<Copyright />
			</Container>
		</Box>
	)
}
