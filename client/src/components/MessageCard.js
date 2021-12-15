// @ Libraries
import React from 'react'
import { useLocation } from 'react-router-dom'

// @ Mui
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

// @ Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import SendIcon from '@material-ui/icons/Send'
import DoneAllIcon from '@material-ui/icons/DoneAll'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomAvatar from './CustomAvatar'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Main
const MessageCard = ({ msg, handleExpandClick, expanded, handleSelect, isChecked, path }) => {
	const checkExpanded = () => {
		return expanded.some((obj) => obj.id === msg._id)
	}

	return (
		<Card>
			<CardHeader
				avatar={
					<CustomAvatar
						size="medium"
						user={path === 'received' ? msg.sender.username : msg.recipient.username}
					/>
				}
				title={
					<Box
						color={!msg.read ? 'primary.main' : 'inherit'}
						fontWeight="fontWeightBold"
						style={{ wordBreak: 'break-word', marginBottom: '0.25em' }}
					>
						{msg.subject}
					</Box>
				}
				subheader={
					<Box display="flex">
						<CustomTooltip title={formatDate(msg.createdAt)}>
							<Chip
								size="small"
								color="primary"
								variant="outlined"
								label={<Box>Sent {calculateTimeAgo(msg.createdAt)}</Box>}
								// icon={<SendIcon />}
							/>
						</CustomTooltip>

						<Box ml={0.5}>
							{!msg.read && (
								<Chip
									size="small"
									color="secondary"
									label={path === 'received' ? 'New' : 'Unread'}
									// icon={<DoneAllIcon />}
								/>
							)}
						</Box>
						{msg.readAt && (
							<CustomTooltip title={formatDate(msg.readAt)}>
								<Chip
									size="small"
									color="primary"
									variant="outlined"
									label={<Box>{calculateTimeAgo(msg.readAt)} </Box>}
									// icon={<DoneAllIcon />}
								/>
							</CustomTooltip>
						)}
					</Box>
				}
			/>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" width="100%">
					<Checkbox checked={isChecked} onChange={(e) => handleSelect(e, msg._id, 'received')} size="small" />
					<IconButton onClick={() => handleExpandClick(msg._id, msg.read)}>
						{expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
					</IconButton>
				</Box>
			</CardActions>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>{msg.message}</CardContent>
			</Collapse>
		</Card>
	)
}

export default MessageCard
