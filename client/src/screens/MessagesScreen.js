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
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// @ Others
import { getAllMessages } from '../actions/messageActions'

// @ Styles
// @ Styles
const useStyles = makeStyles((theme) => ({
	grid   : {
		marginTop : theme.spacing(4)
	},
	appbar : {
		marginTop : theme.spacing(2)
	},
	title  : {
		textOverflow : 'ellipsis',
		overflow     : 'hidden',
		width        : '250px'
	},
	avatar : {
		width  : theme.spacing(4),
		height : theme.spacing(4)
	}
}))

// @ Main
const MessagesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ tab, setTab ] = useState('received')

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

	return (
		<Fragment>
			<AppBar className={cls.appbar} position="static" color="transparent" elevation="2">
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
					justifyContent="center"
					alignItems="center"
					spacing={1}
				>
					{received.map((msg) => (
						<Grid item container xs={12} md={8}>
							<Box
								bgcolor="background.paper"
								width="100%"
								p={1}
								display="flex"
								boxShadow={1}
								borderRadius={4}
							>
								<Box mr={1} display="flex" justifyContent="center" alignItems="center">
									<Checkbox size="small" />
									<Avatar className={cls.avatar}>
										<Box fontSize={12}>{msg.sender.username.substring(0, 2).toUpperCase()}</Box>
									</Avatar>
								</Box>

								<Divider flexItem orientation="vertical" />

								<Box ml={2} display="flex" flexDirection="column" justifyContent="center">
									<Box fontSize={11} color="grey.500" fontStyle="italic">
										from {msg.sender.username}
									</Box>

									<Box mt={0.5} className={cls.title} fontWeight={!msg.read && 'fontWeightBold'}>
										{msg.subject}
									</Box>

									<Box mt={0.5} fontSize={11} color="grey.500" fontStyle="italic">
										{formatDistance(parseISO(msg.createdAt), new Date(), {
											addSuffix : true
										})}
									</Box>
								</Box>
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
					justifyContent="center"
					alignItems="center"
					spacing={1}
				>
					{sent.map((msg) => (
						<Grid item container xs={12} md={8}>
							<Box
								bgcolor="background.paper"
								width="100%"
								p={1}
								display="flex"
								boxShadow={1}
								borderRadius={4}
							>
								<Box mr={1} display="flex" justifyContent="center" alignItems="center">
									<Checkbox size="small" />
									<Avatar className={cls.avatar}>
										<Box fontSize={12}>{msg.recipient.username.substring(0, 2).toUpperCase()}</Box>
									</Avatar>
								</Box>

								<Divider flexItem orientation="vertical" />

								<Box ml={2} display="flex" flexDirection="column" justifyContent="center">
									<Box fontSize={11} color="grey.500" fontStyle="italic">
										from {msg.recipient.username}
									</Box>

									<Box mt={0.5} className={cls.title} fontWeight={!msg.read && 'fontWeightBold'}>
										{msg.subject}
									</Box>

									<Box mt={0.5} fontSize={11} color="grey.500" fontStyle="italic">
										{formatDistance(parseISO(msg.createdAt), new Date(), {
											addSuffix : true
										})}
									</Box>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default MessagesScreen
