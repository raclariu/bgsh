import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import { signOut } from '../actions/userActions'

const useStyles = makeStyles(() => ({
	root     : {
		flexGrow : 1
	},
	title    : {
		flexGrow : 1
	},
	list     : {
		width : 250
	},
	fullList : {
		width : 'auto'
	},
	listText : {
		textDecoration : 'none'
	}
}))

const Header = () => {
	const classes = useStyles()

	const [ isOpen, setIsOpen ] = useState(false)

	const dispatch = useDispatch()

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	const signOutHandler = () => {
		dispatch(signOut())
	}

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						BoardGames
					</Typography>

					{userInfo ? (
						<Fragment>
							<IconButton onClick={() => setIsOpen(!isOpen)} color="inherit" aria-label="menu">
								<AccountCircleIcon />
							</IconButton>
							<Drawer anchor="right" open={isOpen} onClick={() => setIsOpen(!isOpen)}>
								<List className={classes.list}>
									<ListItem button component={RouterLink} to="/">
										<ListItemIcon>
											<HomeIcon />
										</ListItemIcon>
										<ListItemText primary="Home" />
									</ListItem>

									<Divider />

									<ListItem button component={RouterLink} to="/collection">
										<ListItemIcon>
											<PersonIcon />
										</ListItemIcon>
										<ListItemText primary="My Collection" />
									</ListItem>

									<Divider />

									<ListItem button component={RouterLink} to="/signout" onClick={signOutHandler}>
										<ListItemIcon>
											<MeetingRoomIcon />
										</ListItemIcon>
										<ListItemText primary="Sign Out" />
									</ListItem>
								</List>
							</Drawer>
						</Fragment>
					) : (
						<Fragment>
							<Button color="inherit" component={RouterLink} to="/signin">
								Sign In
							</Button>

							<IconButton onClick={() => setIsOpen(!isOpen)} color="inherit" aria-label="menu">
								<MenuIcon />
							</IconButton>
							<Drawer anchor="right" open={isOpen} onClick={() => setIsOpen(!isOpen)}>
								<List className={classes.list}>
									<ListItem button component={RouterLink} to="/">
										<ListItemIcon>
											<HomeIcon />
										</ListItemIcon>
										<ListItemText primary="Home" />
									</ListItem>
								</List>
							</Drawer>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default Header
