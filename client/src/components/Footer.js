// @ Libraries
import React from 'react'
import makeStyles from '@mui/styles/makeStyles';

// @ Mui
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

// @ Styles
const useStyles = makeStyles((theme) => ({
	footer : {
		padding         : theme.spacing(3, 2),
		marginTop       : 'auto',
		backgroundColor :
			theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.paper
	}
}))

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary">
			{'Copyright © '}
			<Link color="inherit" href="/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

// @ Main
export default function StickyFooter() {
	const classes = useStyles()

	return (
		<footer className={classes.footer}>
			<Container maxWidth="sm">
				<Typography variant="body1">Footer Placeholder</Typography>
				<Copyright />
			</Container>
		</footer>
	)
}
