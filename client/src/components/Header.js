// @ Libraries
import React, { Fragment, useState } from 'react'
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// @ Icons
import MenuIcon from '@mui/icons-material/Menu'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone'
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone'
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone'
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import LocalActivityTwoToneIcon from '@mui/icons-material/LocalActivityTwoTone'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import SwapHorizontalCircleTwoToneIcon from '@mui/icons-material/SwapHorizontalCircleTwoTone'
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone'
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone'

// @ Components
import MessagesBadge from './MessagesBadge'
import SaleListPopover from './SaleListPopover'
import Theme from './Theme'
import CustomAvatar from './CustomAvatar'
import NotificationsPopover from './NotificationsPopover'

// @ Others
import { signOut } from '../actions/userActions'

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
    title: `${PREFIX}-title`,
    list: `${PREFIX}-list`,
    fullList: `${PREFIX}-fullList`,
    listText: `${PREFIX}-listText`,
    avatar: `${PREFIX}-avatar`,
    nested: `${PREFIX}-nested`,
    paper: `${PREFIX}-paper`,
    ml: `${PREFIX}-ml`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
		flexGrow : 1
	},

    [`& .${classes.title}`]: {
		flexGrow : 1
	},

    [`& .${classes.list}`]: {
		width : 250
	},

    [`& .${classes.fullList}`]: {
		width : 'auto'
	},

    [`& .${classes.listText}`]: {
		textDecoration : 'none'
	},

    [`& .${classes.avatar}`]: {
		width           : theme.spacing(5),
		height          : theme.spacing(5),
		backgroundColor : theme.palette.primary.main
	},

    [`& .${classes.nested}`]: {
		paddingLeft : theme.spacing(4)
	},

    [`& .${classes.paper}`]: {
		borderRadius : theme.spacing(2),
		marginTop    : '2vh',
		marginRight  : '1vh',
		height       : '96vh'
	},

    [`& .${classes.ml}`]: {
		marginLeft : theme.spacing(2)
	}
}));

// @ Main
const Header = () => {

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
        <Root className={classes.root}>
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
								<NotificationsPopover />
							</Box>
							<Box mr={1}>
								<MessagesBadge />
							</Box>
							<Box mr={1}>
								<SaleListPopover />
							</Box>
							<Box mr={1}>
								<Theme />
							</Box>

							<IconButton
                                color="primary"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="menu"
                                size="large">
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
								<DialogTitle>
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
		</Root>
    );
}

export default Header
