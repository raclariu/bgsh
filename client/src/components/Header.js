// @ Libraries
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
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
import Avatar from '@material-ui/core/Avatar'
import Collapse from '@material-ui/core/Collapse'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

// @ Icons
import MenuIcon from '@material-ui/icons/Menu'
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone'
import LibraryBooksTwoToneIcon from '@material-ui/icons/LibraryBooksTwoTone'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone'
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone'
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone'
import MeetingRoomTwoToneIcon from '@material-ui/icons/MeetingRoomTwoTone'
import BookmarkTwoToneIcon from '@material-ui/icons/BookmarkTwoTone'
import ArchiveTwoToneIcon from '@material-ui/icons/ArchiveTwoTone'
import LocalActivityTwoToneIcon from '@material-ui/icons/LocalActivityTwoTone'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import SwapHorizontalCircleTwoToneIcon from '@material-ui/icons/SwapHorizontalCircleTwoTone'
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone'
import InboxTwoToneIcon from '@material-ui/icons/InboxTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone'
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone'
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone'

// @ Components
import MessagesBadge from './MessagesBadge'
import SaleListPopover from './SaleListPopover'
import Theme from './Theme'
import CustomAvatar from './CustomAvatar'

// @ Others
import { signOut } from '../actions/userActions'

// @ Styles
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
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main
	},
	nested   : {
		paddingLeft : theme.spacing(4)
	},
	paper    : {
		borderRadius : theme.spacing(2),
		marginTop    : '2vh',
		marginRight  : '1vh',
		height       : '96vh'
	},
	ml       : {
		marginLeft : theme.spacing(2)
	}
}))

// @ Main
const Header = () => {
	const classes = useStyles()
	const dispatch = useDispatch()

	const [ isOpen, setIsOpen ] = useState(false)
	const [ openGames, setOpenGames ] = useState(false)
	const [ openHistory, setOpenHistory ] = useState(false)
	const [ openInbox, setOpenInbox ] = useState(false)
	const [ selectedIndex, setSelectedIndex ] = useState(0)
	const [ openDialog, setOpenDialog ] = useState(false)

	const userAuth = useSelector((state) => state.userAuth)
	const { userData } = userAuth

	const signOutHandler = () => {
		dispatch(signOut())
		setOpenDialog(false)
		setIsOpen(false)
	}

	const handleExpandClick = (type) => {
		if (type === 'games') {
			setOpenGames(!openGames)
		}
		if (type === 'history') {
			setOpenHistory(!openHistory)
		}
		if (type === 'inbox') {
			setOpenInbox(!openInbox)
		}
	}

	const handleClick = (e, ind) => {
		setSelectedIndex(ind)
		setIsOpen(false)
	}

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<div className={classes.root}>
			<AppBar elevation={1} position="static" color="transparent">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						BoardGames
					</Typography>

					{!userData && (
						<Box mr={1}>
							<Theme />
						</Box>
					)}

					{userData ? (
						<Fragment>
							<Box mr={1}>
								<MessagesBadge />
							</Box>
							<Box mr={1}>
								<SaleListPopover />
							</Box>
							<Box mr={1}>
								<Theme />
							</Box>

							<IconButton color="primary" onClick={() => setIsOpen(!isOpen)} aria-label="menu">
								<MenuIcon />
							</IconButton>

							<Drawer
								classes={{ paper: classes.paper }}
								anchor="right"
								open={isOpen}
								onClose={() => setIsOpen(!isOpen)}
							>
								<Box display="flex" alignItems="center" justifyContent="flex-end" m={2}>
									<Box display="flex" alignItems="center">
										<Box fontWeight="fontWeightMedium" mr={1}>
											{userData.username}
										</Box>
										<Avatar className={classes.avatar}>
											<Box fontSize={14}>{userData.username.substring(0, 2).toUpperCase()}</Box>
										</Avatar>
									</Box>
									{/* <IconButton
										color="primary"
										onClick={() => setIsOpen(false)}
										component={RouterLink}
										to="/settings"
									>
										<SettingsTwoToneIcon />
									</IconButton> */}
								</Box>

								<Box>
									<Divider />
									<List disablePadding className={classes.list}>
										<ListItem
											button
											onClick={(e) => handleClick(e, 1)}
											selected={selectedIndex === 1}
											component={RouterLink}
											to="/"
										>
											<ListItemIcon>
												<HomeTwoToneIcon color={selectedIndex === 1 ? 'primary' : 'inherit'} />
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 1 ? 'primary.main' : 'text.secondary'}
													>
														Home
													</Box>
												}
											/>
										</ListItem>

										<ListItem button onClick={() => handleExpandClick('games')}>
											<ListItemIcon>
												<DashboardTwoToneIcon />
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color="text.secondary"
													>
														Board games
													</Box>
												}
											/>
											{openGames ? (
												<ArrowDropUpIcon color="disabled" />
											) : (
												<ArrowDropDownIcon color="disabled" />
											)}
										</ListItem>

										<Collapse in={openGames} timeout="auto" unmountOnExit>
											<List disablePadding>
												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 2)}
													selected={selectedIndex === 2}
													component={RouterLink}
													to="/games"
												>
													<ListItemIcon>
														<MonetizationOnTwoToneIcon
															color={selectedIndex === 2 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 2 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Sales
															</Box>
														}
													/>
												</ListItem>

												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 3)}
													selected={selectedIndex === 3}
													component={RouterLink}
													to="/trades"
												>
													<ListItemIcon>
														<SwapHorizontalCircleTwoToneIcon
															color={selectedIndex === 3 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 3 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Trades
															</Box>
														}
													/>
												</ListItem>

												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 13)}
													selected={selectedIndex === 13}
													component={RouterLink}
													to="/wanted"
												>
													<ListItemIcon>
														<AddCircleTwoToneIcon
															color={selectedIndex === 13 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 13 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Wanted
															</Box>
														}
													/>
												</ListItem>
											</List>
										</Collapse>

										<ListItem
											button
											onClick={(e) => handleClick(e, 4)}
											selected={selectedIndex === 4}
											component={RouterLink}
											to="/profile"
										>
											<ListItemIcon>
												<AccountCircleTwoToneIcon
													color={selectedIndex === 4 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 4 ? 'primary.main' : 'text.secondary'}
													>
														Profile
													</Box>
												}
											/>
										</ListItem>

										<ListItem
											button
											onClick={(e) => handleClick(e, 5)}
											selected={selectedIndex === 5}
											component={RouterLink}
											to="/collection"
										>
											<ListItemIcon>
												<LibraryBooksTwoToneIcon
													color={selectedIndex === 5 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 5 ? 'primary.main' : 'text.secondary'}
													>
														My collection
													</Box>
												}
											/>
										</ListItem>

										<ListItem
											button
											onClick={(e) => handleClick(e, 6)}
											selected={selectedIndex === 6}
											component={RouterLink}
											to="/wishlist"
										>
											<ListItemIcon>
												<FavoriteTwoToneIcon
													color={selectedIndex === 6 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 6 ? 'primary.main' : 'text.secondary'}
													>
														My wishlist
													</Box>
												}
											/>
										</ListItem>

										<ListItem
											button
											onClick={(e) => handleClick(e, 7)}
											selected={selectedIndex === 7}
											component={RouterLink}
											to="/saved"
										>
											<ListItemIcon>
												<BookmarkTwoToneIcon
													color={selectedIndex === 7 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 7 ? 'primary.main' : 'text.secondary'}
													>
														Saved games
													</Box>
												}
											/>
										</ListItem>

										<ListItem button onClick={() => handleExpandClick('inbox')}>
											<ListItemIcon>
												<EmailTwoToneIcon />
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color="text.secondary"
													>
														Inbox
													</Box>
												}
											/>
											{openGames ? (
												<ArrowDropUpIcon color="disabled" />
											) : (
												<ArrowDropDownIcon color="disabled" />
											)}
										</ListItem>

										<Collapse in={openInbox} timeout="auto" unmountOnExit>
											<List disablePadding>
												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 8)}
													selected={selectedIndex === 8}
													component={RouterLink}
													to="/received"
												>
													<ListItemIcon>
														<InboxTwoToneIcon
															color={selectedIndex === 8 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 8 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Received
															</Box>
														}
													/>
												</ListItem>

												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 9)}
													selected={selectedIndex === 9}
													component={RouterLink}
													to="/sent"
												>
													<ListItemIcon>
														<SendTwoToneIcon
															color={selectedIndex === 9 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 9 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Sent
															</Box>
														}
													/>
												</ListItem>
											</List>
										</Collapse>

										<ListItem
											button
											onClick={(e) => handleClick(e, 10)}
											selected={selectedIndex === 10}
											component={RouterLink}
											to="/user/listed"
										>
											<ListItemIcon>
												<LocalActivityTwoToneIcon
													color={selectedIndex === 10 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 10 ? 'primary.main' : 'text.secondary'}
													>
														My listed games
													</Box>
												}
											/>
										</ListItem>

										<ListItem button onClick={() => handleExpandClick('history')}>
											<ListItemIcon>
												<ArchiveTwoToneIcon />
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color="text.secondary"
													>
														My History
													</Box>
												}
											/>
											{openHistory ? (
												<ArrowDropUpIcon color="disabled" />
											) : (
												<ArrowDropDownIcon color="disabled" />
											)}
										</ListItem>
										<Collapse in={openHistory} timeout="auto" unmountOnExit>
											<List disablePadding>
												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 11)}
													selected={selectedIndex === 11}
													component={RouterLink}
													to="/user/history/sold"
												>
													<ListItemIcon>
														<MonetizationOnTwoToneIcon
															color={selectedIndex === 11 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 11 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Sold
															</Box>
														}
													/>
												</ListItem>

												<ListItem
													className={classes.nested}
													button
													onClick={(e) => handleClick(e, 12)}
													selected={selectedIndex === 12}
													component={RouterLink}
													to="/user/history/traded"
												>
													<ListItemIcon>
														<SwapHorizontalCircleTwoToneIcon
															color={selectedIndex === 12 ? 'primary' : 'inherit'}
														/>
													</ListItemIcon>
													<ListItemText
														primary={
															<Box
																fontWeight="fontWeightMedium"
																fontSize="subtitle2.fontSize"
																color={
																	selectedIndex === 12 ? (
																		'primary.main'
																	) : (
																		'text.secondary'
																	)
																}
															>
																Traded
															</Box>
														}
													/>
												</ListItem>
											</List>
										</Collapse>

										<ListItem
											button
											onClick={(e) => handleClick(e, 14)}
											selected={selectedIndex === 14}
											component={RouterLink}
											to="/user/settings"
										>
											<ListItemIcon>
												<SettingsTwoToneIcon
													color={selectedIndex === 14 ? 'primary' : 'inherit'}
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color={selectedIndex === 14 ? 'primary.main' : 'text.secondary'}
													>
														Settings
													</Box>
												}
											/>
										</ListItem>

										<ListItem button onClick={handleOpenDialog}>
											<ListItemIcon>
												<MeetingRoomTwoToneIcon />
											</ListItemIcon>
											<ListItemText
												primary={
													<Box
														fontWeight="fontWeightMedium"
														fontSize="subtitle2.fontSize"
														color="text.secondary"
													>
														Sign Out
													</Box>
												}
											/>
										</ListItem>
									</List>
								</Box>
							</Drawer>

							<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
								<DialogTitle disableTypography>
									<Typography variant="subtitle2" align="center">
										Are you sure you want to sign out?
									</Typography>
								</DialogTitle>

								<DialogContent>
									<Box display="flex" justifyContent="center" alignItems="center">
										<Button onClick={signOutHandler} variant="contained" color="primary">
											Yes
										</Button>
										<Button className={classes.ml} onClick={handleCloseDialog} color="primary">
											No
										</Button>
									</Box>
								</DialogContent>
							</Dialog>
						</Fragment>
					) : (
						<Fragment>
							<Button color="primary" variant="outlined" component={RouterLink} to="/signin">
								Sign In
							</Button>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default Header
