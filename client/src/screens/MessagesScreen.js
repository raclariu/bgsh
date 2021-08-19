// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { formatDistance, parseISO } from 'date-fns'

// @ Components
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Chip from '@material-ui/core/Chip'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ButtonBase from '@material-ui/core/ButtonBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// @ Others
import { getAllMessages } from '../actions/messageActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid       : {
		marginTop : theme.spacing(4)
	},
	appbar     : {
		marginTop       : theme.spacing(2),
		backgroundColor : theme.palette.background.paper
	},
	buttonBase : {
		width : '100%'
	},
	subject    : {
		whiteSpace                     : 'nowrap',
		textOverflow                   : 'ellipsis',
		overflow                       : 'hidden',
		width                          : '80%',
		[theme.breakpoints.down('xs')]: {
			width : 200
		}
	},
	avatar     : {
		margin : theme.spacing(0, 1, 0, 1)
	}
}))

// @ Main
const MessagesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ tab, setTab ] = useState('received')
	const [ checked, setChecked ] = useState([])

	const messagesSelector = useSelector((state) => state.messages)
	const { loading, success, error, received, sent } = messagesSelector

	useEffect(
		() => {
			dispatch(getAllMessages())
		},
		[ dispatch ]
	)

	const handleTabChange = (event, newTab) => {
		setTab(newTab)
	}

	const handleChecked = (e, id) => {
		if (e.target.checked) {
			setChecked([ ...checked, id ])
		} else {
			setChecked(checked.filter((chk) => chk !== id))
		}
	}

	const handleSelectAll = (e) => {
		if (e.target.checked) {
			setChecked(sent.map((el) => el._id))
		} else {
			setChecked([])
		}
	}

	console.log(checked)

	return (
		<Fragment>
			<AppBar className={cls.appbar} position="static" color="transparent" elevation={2}>
				<Tabs value={tab} centered indicatorColor="secondary" textColor="secondary" onChange={handleTabChange}>
					<Tab value="received" label="Received" />
					<Tab value="sent" label="Sent" />
				</Tabs>
			</AppBar>

			{success &&
			tab === 'received' && (
				<Grid
					className={cls.grid}
					container
					direction="column"
					justify="center"
					alignItems="center"
					spacing={1}
				>
					<Grid item container justify="flex-start" alignItems="center" xs={12} md={8}>
						<FormControlLabel
							control={<Checkbox label="Select all" disabled={!success} onChange={handleSelectAll} />}
						/>
					</Grid>
					{received.map((msg) => (
						<Grid key={msg._id} item container xs={12} sm={8}>
							<Box width="100%" bgcolor="background.paper" boxShadow={2} borderRadius={4}>
								<ListItem button>
									<ListItemAvatar>
										<Avatar className={cls.avatar}>
											<Box className={cls.subject} fontSize={12}>
												{msg.sender.username.substring(0, 2).toUpperCase()}
											</Box>
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Box fontWeight={!msg.read && 'fontWeightBold'}>
												{msg.subject}ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
											</Box>
										}
										secondary={formatDistance(parseISO(msg.createdAt), new Date(), {
											addSuffix : true
										})}
									/>
								</ListItem>
							</Box>
						</Grid>
					))}
				</Grid>
			)}

			{success &&
			tab === 'sent' && (
				<Grid
					className={cls.grid}
					container
					direction="column"
					justify="center"
					alignItems="center"
					spacing={1}
				>
					<Grid item container justify="flex-start" alignItems="center" xs={12} sm={11} md={7}>
						<FormControlLabel
							label="Select all"
							control={
								<Checkbox
									size="small"
									label="Select all"
									disabled={!success}
									onChange={handleSelectAll}
								/>
							}
						/>
					</Grid>
					{sent.map((msg) => (
						<Grid key={msg._id} item container xs={12} sm={11} md={7}>
							<ButtonBase className={cls.buttonBase} component="div">
								<Box
									display="flex"
									p={1}
									boxShadow={1}
									borderRadius={4}
									width="100%"
									bgcolor="background.paper"
								>
									<Box display="flex" justifyContent="center" alignItems="center">
										<Checkbox
											checked={checked.some((el) => el === msg._id)}
											onChange={(e) => handleChecked(e, msg._id)}
											size="small"
										/>
										<Avatar className={cls.avatar}>
											<Box fontSize={14}>
												{msg.recipient.username.substring(0, 2).toUpperCase()}
											</Box>
										</Avatar>
									</Box>

									<Divider flexItem orientation="vertical" />

									<Box
										ml={1}
										my={1.5}
										display="flex"
										flexDirection="column"
										justifyContent="center"
										width="100%"
									>
										<Box
											className={cls.subject}
											fontSize={16}
											fontWeight={!msg.read && 'fontWeightBold'}
										>
											{msg.subject}ssssssssssssssssssssssssssssssssssssssss
										</Box>

										<Box mt={1} fontSize={11} color="grey.500" fontStyle="italic">
											{formatDistance(parseISO(msg.createdAt), new Date(), {
												addSuffix : true
											})}
										</Box>
									</Box>
								</Box>
							</ButtonBase>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default MessagesScreen
