// @ Libraries
import React from 'react'
import { useLocation } from 'react-router-dom'

// @ Mui
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SendIcon from '@mui/icons-material/Send'
import DoneAllIcon from '@mui/icons-material/DoneAll'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomAvatar from './CustomAvatar'

// @ Others
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Main
const MessageCard = ({ msg, handleExpandClick, expanded, handleSelect, isChecked, path }) => {
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
							/>
						</CustomTooltip>

						<Box ml={0.5}>
							{!msg.read && (
								<Chip size="small" color="secondary" label={path === 'received' ? 'New' : 'Unread'} />
							)}
						</Box>
						{msg.readAt && (
							<CustomTooltip title={formatDate(msg.readAt)}>
								<Chip
									size="small"
									color="primary"
									variant="outlined"
									label={<Box>{calculateTimeAgo(msg.readAt)} </Box>}
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
					<IconButton onClick={() => handleExpandClick(msg._id, msg.read)} size="large">
						{expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
					</IconButton>
				</Box>
			</CardActions>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>{msg.message}</CardContent>
			</Collapse>
		</Card>
    );
}

export default MessageCard
