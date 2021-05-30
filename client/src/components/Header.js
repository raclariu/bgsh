import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import SaleListPopover from './SaleListPopover'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined'
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined'
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined'
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined'
import { signOut } from '../actions/userActions'
import pink from '@material-ui/core/colors/pink'

const useStyles = makeStyles((theme) => ({
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
	},
	avatar   : {
		color           : theme.palette.getContrastText(pink[500]),
		backgroundColor : pink[500],
		width           : theme.spacing(4),
		height          : theme.spacing(4)
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
			<AppBar elevation={1} position="static" color="transparent">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						BoardGames
					</Typography>

					{userInfo ? (
						<Fragment>
							<SaleListPopover />

							<IconButton onClick={() => setIsOpen(!isOpen)} color="inherit" aria-label="menu">
								<MenuIcon />
							</IconButton>
							<Drawer anchor="right" open={isOpen} onClick={() => setIsOpen(!isOpen)}>
								<List className={classes.list}>
									<ListItem button component={RouterLink} to="/">
										<ListItemIcon>
											<HomeOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Home" />
									</ListItem>

									<Divider />

									<ListItem button component={RouterLink} to="/profile">
										<ListItemIcon>
											<PersonOutlineOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Profile" />
									</ListItem>

									<ListItem button component={RouterLink} to="/collection">
										<ListItemIcon>
											<LibraryBooksOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="My Collection" />
									</ListItem>

									<ListItem button component={RouterLink} to="/wishlist">
										<ListItemIcon>
											<FavoriteBorderOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="My Wishlist" />
									</ListItem>

									<Divider />

									<ListItem button component={RouterLink} to="/signout" onClick={signOutHandler}>
										<ListItemIcon>
											<MeetingRoomOutlinedIcon />
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
											<HomeOutlinedIcon />
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
