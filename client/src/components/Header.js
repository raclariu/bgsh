import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone'
import MenuIcon from '@material-ui/icons/Menu'
import SaleListPopover from './SaleListPopover'
import LibraryBooksTwoToneIcon from '@material-ui/icons/LibraryBooksTwoTone'
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone'
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone'
import MeetingRoomTwoToneIcon from '@material-ui/icons/MeetingRoomTwoTone'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import Theme from './Theme'
import pink from '@material-ui/core/colors/pink'
import { signOut } from '../actions/userActions'

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
	// selected : {
	// 	'&.Mui-selected' : {
	// 		// consoleackgroundColor : theme.palette.background.default,
	// 		color      : theme.palette.primary.light,
	// 		fontWeight : '500'
	// 	}
	// }
}))

const Header = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { pathname } = useLocation()
	const location = useLocation()
	console.log(location)
	// console.log(pathname.split('/'))

	const [ isOpen, setIsOpen ] = useState(false)

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	const signOutHandler = () => {
		dispatch(signOut())
	}

	return (
		<div className={classes.root}>
			<AppBar elevation={2} position="static" color="background.paper">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						BoardGames
					</Typography>

					{userInfo ? (
						<Fragment>
							<SaleListPopover />
							<Theme />

							<IconButton onClick={() => setIsOpen(!isOpen)} color="inherit" aria-label="menu">
								<MenuIcon color="primary" />
							</IconButton>
							<Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(!isOpen)}>
								<Box boxShadow={2} height={100} p={2} bgcolor="warning.main">
									Hey {userInfo.username}
								</Box>
								<Box>
									<List disablePadding className={classes.list} onClick={() => setIsOpen(!isOpen)}>
										<Divider />

										<ListItem selected={pathname === '/'} button component={RouterLink} to="/">
											<ListItemIcon>
												<HomeTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Home" />
										</ListItem>

										<ListItem
											selected={pathname === '/games'}
											button
											component={RouterLink}
											to="/games"
										>
											<ListItemIcon>
												<DashboardTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Board Games" />
										</ListItem>

										<ListItem
											selected={pathname === '/profile'}
											button
											component={RouterLink}
											to="/profile"
										>
											<ListItemIcon>
												<PersonOutlineTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Profile" />
										</ListItem>

										<ListItem
											selected={pathname === '/collection'}
											button
											component={RouterLink}
											to="/collection"
										>
											<ListItemIcon>
												<LibraryBooksTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="My Collection" />
										</ListItem>

										<ListItem
											selected={pathname === '/wishlist'}
											button
											component={RouterLink}
											to="/wishlist"
										>
											<ListItemIcon>
												<FavoriteTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="My Wishlist" />
										</ListItem>

										<ListItem
											selected={pathname === '/saved'}
											button
											component={RouterLink}
											to="/saved"
										>
											<ListItemIcon>
												<BookmarkTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="My Saved Games" />
										</ListItem>

										<ListItem
											selected={pathname === '/my-games'}
											button
											component={RouterLink}
											to="/my-games"
										>
											<ListItemIcon>
												<BookmarkTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Active" />
										</ListItem>

										<ListItem
											selected={pathname === '/my-games/history/sold'}
											button
											component={RouterLink}
											to="/my-games/history/sold"
										>
											<ListItemIcon>
												<BookmarkTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="History Sold" />
										</ListItem>

										<ListItem
											selected={pathname === '/my-games/history/'}
											divider
											button
											component={RouterLink}
											to="/my-games/history/traded"
										>
											<ListItemIcon>
												<BookmarkTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="History Trades" />
										</ListItem>

										<ListItem button component={RouterLink} to="/signout" onClick={signOutHandler}>
											<ListItemIcon>
												<MeetingRoomTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Sign Out" />
										</ListItem>
									</List>
								</Box>
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
											<HomeTwoToneIcon />
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
