import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
	footer : {
		padding         : theme.spacing(3, 2),
		marginTop       : 'auto',
		backgroundColor :
			theme.palette.type === 'light' ? theme.palette.background.paper : theme.palette.background.paper
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
