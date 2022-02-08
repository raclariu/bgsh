// @ Libraries
import React from 'react'
import { useLocation } from 'react-router-dom'

// @ Mui
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SendIcon from '@mui/icons-material/Send'
import DoneAllIcon from '@mui/icons-material/DoneAll'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomTooltip from './CustomTooltip'
import CustomAvatar from './CustomAvatar'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Main
const MessageCard = ({ msg, handleExpandClick, expanded, handleSelect, isChecked, path }) => {
	return (
		<Card elevation={2}>
			<CardHeader
				avatar={
					<CustomAvatar
						size={5}
						username={path === 'received' ? msg.sender.username : msg.recipient.username}
						src={path === 'received' ? msg.sender.avatar : msg.recipient.avatar}
					/>
				}
				title={
					<Box
						color={!msg.read ? 'primary.main' : 'inherit'}
						fontWeight="fontWeightBold"
						mb="0.25em"
						sx={{ wordBreak: 'break-word' }}
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
							/>
						</CustomTooltip>

						{!msg.read && (
							<Chip
								sx={{ ml: 0.5 }}
								size="small"
								color="secondary"
								label={path === 'received' ? 'New' : 'Unread'}
							/>
						)}

						{msg.readAt && (
							<CustomTooltip title={formatDate(msg.readAt)}>
								<Chip
									sx={{ ml: 0.5 }}
									size="small"
									color="primary"
									variant="outlined"
									label={<Box>Read {calculateTimeAgo(msg.readAt)} </Box>}
								/>
							</CustomTooltip>
						)}
					</Box>
				}
			/>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Checkbox checked={isChecked} onChange={(e) => handleSelect(e, msg._id, 'received')} size="small" />
					<CustomIconBtn onClick={() => handleExpandClick(msg._id, msg.read)}>
						{expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
					</CustomIconBtn>
				</Box>
			</CardActions>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>{msg.message}</CardContent>
			</Collapse>
		</Card>
	)
}

export default MessageCard
