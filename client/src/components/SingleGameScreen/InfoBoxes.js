import React, { Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone'
import AccessTimeTwoToneIcon from '@material-ui/icons/AccessTimeTwoTone'
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone'
import ChildCareTwoToneIcon from '@material-ui/icons/ChildCareTwoTone'

const defaultBox = {
	display        : 'flex',
	flexDirection  : 'column',
	alignItems     : 'center',
	justifyContent : 'center',
	boxShadow      : 2,
	p              : 1,
	borderRadius   : 4,
	bgcolor        : 'background.paper'
}

const InfoBoxes = ({ data }) => {
	return (
		<Fragment>
			<Grid item xs={6} sm={3}>
				<Box {...defaultBox}>
					<Box>
						<PeopleAltTwoToneIcon fontSize="small" color="primary" />
					</Box>
					<Box fontSize={12} textAlign="center">
						{data.minPlayers} - {data.maxPlayers} players
					</Box>
				</Box>
			</Grid>

			<Grid item xs={6} sm={3}>
				<Box {...defaultBox}>
					<Box>
						<PersonAddTwoToneIcon fontSize="small" color="primary" />
					</Box>
					<Box fontSize={12} textAlign="center">
						{data.suggestedPlayers ? `${data.suggestedPlayers} players` : 'N/A'}
					</Box>
				</Box>
			</Grid>

			<Grid item xs={6} sm={3}>
				<Box {...defaultBox}>
					<Box>
						<AccessTimeTwoToneIcon fontSize="small" color="primary" />
					</Box>
					<Box fontSize={12} textAlign="center">
						{data.playTime ? `${data.playTime} min.` : 'N/A'}
					</Box>
				</Box>
			</Grid>

			<Grid item xs={6} sm={3}>
				<Box {...defaultBox}>
					<Box>
						<ChildCareTwoToneIcon fontSize="small" color="primary" />
					</Box>
					<Box fontSize={12} textAlign="center">
						{data.minAge ? `${data.minAge}` : 'N/A'}
					</Box>
				</Box>
			</Grid>
		</Fragment>
	)
}

export default InfoBoxes
