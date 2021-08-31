// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { formatDistance, parseISO } from 'date-fns'

// @ Components
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
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
import { getSentMessages } from '../actions/messageActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid       : {
		marginTop : theme.spacing(4)
	},
	buttonBase : {
		width : '100%'
	},
	subject    : {
		whiteSpace   : 'nowrap',
		textOverflow : 'ellipsis',
		overflow     : 'hidden',
		width        : '95%'
	}
}))

// @ Main
const InboxSentScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()

	const [ checked, setChecked ] = useState([])

	const messagesSelector = useSelector((state) => state.messagesSent)
	const { loading, success, error, messages } = messagesSelector

	useEffect(
		() => {
			dispatch(getSentMessages())
		},
		[ dispatch ]
	)

	const handleChecked = (e, id) => {
		if (e.target.checked) {
			setChecked([ ...checked, id ])
		} else {
			setChecked(checked.filter((chk) => chk !== id))
		}
	}

	const handleSelectAll = (e) => {
		if (e.target.checked) {
			setChecked(messages.map((el) => el._id))
		} else {
			setChecked([])
		}
	}

	return (
		<Fragment>
			{success && (
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
					className={cls.grid}
					spacing={1}
				>
					<Grid item container justifyContent="flex-start" alignItems="center" xs={12} sm={9} md={7}>
						<FormControlLabel
							label="Select all"
							control={
								<Checkbox
									size="small"
									label="Select all"
									disabled={!success}
									onChange={(e) => handleSelectAll(e, 'received')}
								/>
							}
						/>
					</Grid>
					{messages.map((msg) => (
						<Grid item container key={msg._id} xs={12} sm={9} md={7}>
							<ButtonBase className={cls.buttonBase}>
								<Box
									display="flex"
									boxShadow={2}
									borderRadius={4}
									bgcolor="background.paper"
									alignItems="center"
									width="100%"
								>
									<Box my={1} mr={1}>
										<Checkbox
											checked={checked.some((el) => el === msg._id)}
											onChange={(e) => handleChecked(e, msg._id, 'received')}
											size="small"
										/>
									</Box>

									<Box mr={1}>
										<Avatar>
											<Box fontSize={14}>
												{msg.recipient.username.substring(0, 2).toUpperCase()}
											</Box>
										</Avatar>
									</Box>

									<Divider orientation="vertical" flexItem />

									<Box
										display="flex"
										flexDirection="column"
										justifyContent="center"
										alignItems="flex-start"
										minWidth={0}
										pl={1}
										py={2}
									>
										<Box
											className={cls.subject}
											width="100%"
											fontWeight={msg.read ? 'fontWeightRegular' : 'fontWeightBold'}
											fontSize="subtitle2.fontSize"
										>
											{msg.subject}ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
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

export default InboxSentScreen
