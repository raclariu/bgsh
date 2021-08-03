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
import Collapse from '@material-ui/core/Collapse'
import MenuIcon from '@material-ui/icons/Menu'
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone'
import LibraryBooksTwoToneIcon from '@material-ui/icons/LibraryBooksTwoTone'
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone'
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone'
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone'
import MeetingRoomTwoToneIcon from '@material-ui/icons/MeetingRoomTwoTone'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import ArchiveTwoToneIcon from '@material-ui/icons/ArchiveTwoTone'
import InputTwoToneIcon from '@material-ui/icons/InputTwoTone'
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import SaleListPopover from './SaleListPopover'
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
	},
	nested   : {
		paddingLeft : theme.spacing(4)
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

	const [ isOpen, setIsOpen ] = useState(false)
	const [ openGames, setOpenGames ] = useState(false)
	const [ openHistory, setOpenHistory ] = useState(false)

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	const signOutHandler = () => {
		dispatch(signOut())
		setIsOpen(false)
	}

	const handleExpandClick = (type) => {
		if (type === 'games') {
			setOpenGames(!openGames)
		}
		if (type === 'history') {
			setOpenHistory(!openHistory)
		}
	}

	const handleClick = () => {
		setIsOpen(false)
	}

	return (
		<div className={classes.root}>
			<AppBar elevation={2} position="static" color="inherit">
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
									<List disablePadding className={classes.list}>
										<Divider />

										<ListItem
											onClick={handleClick}
											selected={pathname === '/'}
											button
											component={RouterLink}
											to="/"
										>
											<ListItemIcon>
												<HomeTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Home" />
										</ListItem>

										<ListItem button onClick={() => handleExpandClick('games')}>
											<ListItemIcon>
												<DashboardTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Board Games" />
											{openGames ? <ExpandLess /> : <ExpandMore />}
										</ListItem>
										<Collapse in={openGames} timeout="auto" unmountOnExit>
											<List disablePadding>
												<ListItem
													onClick={handleClick}
													button
													className={classes.nested}
													selected={pathname.includes('/games')}
													component={RouterLink}
													to="/games"
												>
													<ListItemIcon>
														<MonetizationOnTwoToneIcon />
													</ListItemIcon>
													<ListItemText primary="Sales" />
												</ListItem>

												<ListItem
													onClick={handleClick}
													button
													className={classes.nested}
													selected={pathname.includes('/trades')}
													component={RouterLink}
													to="/trades"
												>
													<ListItemIcon>
														<SwapHorizontalCircleOutlinedIcon />
													</ListItemIcon>
													<ListItemText primary="Trades" />
												</ListItem>
											</List>
										</Collapse>

										<ListItem
											onClick={handleClick}
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
											onClick={handleClick}
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
											onClick={handleClick}
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
											onClick={handleClick}
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
											button
											to="/history/active"
											component={RouterLink}
											selected={pathname === '/history/active'}
											onClick={handleClick}
										>
											<ListItemIcon>
												<InputTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="Active" />
										</ListItem>

										<ListItem button onClick={() => handleExpandClick('history')}>
											<ListItemIcon>
												<ArchiveTwoToneIcon />
											</ListItemIcon>
											<ListItemText primary="History" />
											{openHistory ? <ExpandLess /> : <ExpandMore />}
										</ListItem>
										<Collapse in={openHistory} timeout="auto" unmountOnExit>
											<List disablePadding>
												<ListItem
													button
													to="/history/sold"
													component={RouterLink}
													className={classes.nested}
													selected={pathname === '/history/sold'}
													onClick={handleClick}
												>
													<ListItemIcon>
														<MonetizationOnTwoToneIcon />
													</ListItemIcon>
													<ListItemText primary="Sold" />
												</ListItem>

												<ListItem
													button
													to="/history/traded"
													component={RouterLink}
													className={classes.nested}
													selected={pathname === '/history/traded'}
													onClick={handleClick}
												>
													<ListItemIcon>
														<SwapHorizontalCircleOutlinedIcon />
													</ListItemIcon>
													<ListItemText primary="Traded" />
												</ListItem>
											</List>
										</Collapse>

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
