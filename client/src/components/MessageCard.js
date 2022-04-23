// @ Modules
import React from 'react'

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomTooltip from './CustomTooltip'
import CustomAvatar from './CustomAvatar'

// @ Others
import { calculateTimeAgoStrict, formatDate } from '../helpers/helpers'

// @ Main
const MessageCard = ({ msg, handleExpandClick, expanded, handleSelect, isChecked, path }) => {
	return (
		<Card elevation={2}>
			<CardHeader
				disableTypography
				avatar={
					<CustomAvatar
						size={6}
						username={path === 'received' ? msg.sender.username : msg.recipient.username}
						src={path === 'received' ? msg.sender.avatar : msg.recipient.avatar}
					/>
				}
				title={
					<Box
						color={!msg.read ? 'primary.main' : 'inherit'}
						fontSize="body2.fontSize"
						fontWeight="fontWeightBold"
						mb="0.25em"
						sx={{ wordBreak: 'break-word' }}
					>
						{msg.subject}
					</Box>
				}
				subheader={
					<Box display="flex" gap={0.5} flexWrap="wrap">
						<CustomTooltip title={formatDate(msg.createdAt)}>
							<Chip
								size="small"
								color="primary"
								variant="outlined"
								label={<Box>Sent {calculateTimeAgoStrict(msg.createdAt)}</Box>}
							/>
						</CustomTooltip>

						{!msg.read && (
							<Chip size="small" color="secondary" label={path === 'received' ? 'New' : 'Unread'} />
						)}

						{msg.readAt && (
							<CustomTooltip title={formatDate(msg.readAt)}>
								<Chip
									size="small"
									color="primary"
									variant="outlined"
									label={<Box>Seen {calculateTimeAgoStrict(msg.readAt)} </Box>}
								/>
							</CustomTooltip>
						)}
					</Box>
				}
			/>

			<CustomDivider />

			<CardActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
					<Checkbox
						sx={{ height: 48, width: 48 }}
						checked={isChecked}
						onChange={(e) => handleSelect(e, msg._id, 'received')}
					/>
					<Box>
						<CustomTooltip title={expanded ? 'Close message' : 'Open message'}>
							<CustomIconBtn
								onClick={() => handleExpandClick(msg._id, msg.read)}
								size="large"
								color="primary"
							>
								{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</CustomIconBtn>
						</CustomTooltip>
					</Box>
				</Box>
			</CardActions>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>{msg.message}</CardContent>
			</Collapse>
		</Card>
	)
}

export default MessageCard
