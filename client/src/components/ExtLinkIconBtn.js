// @ Libraries
import React, { Fragment, useState } from 'react'

// @ Mui
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'

// @ Icons
import LaunchIcon from '@mui/icons-material/Launch'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import CustomButton from './CustomButton'
import CustomDivider from './CustomDivider'

// @ Main
const ExtLinkIconBtn = ({ url }) => {
	const [ openDialog, setOpenDialog ] = useState(false)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<Fragment>
			<CustomTooltip title="See on BGG">
				<CustomIconBtn onClick={handleOpenDialog} color="primary" size="large">
					<LaunchIcon fontSize="small" />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle>
					<Box textAlign="center">Are you sure you want to open external page to BoardGameGeek.com?</Box>
				</DialogTitle>

				<CustomDivider />

				<DialogActions>
					<CustomButton onClick={handleCloseDialog}>Cancel</CustomButton>

					<CustomButton
						sx={{ ml: 1 }}
						href={url}
						target="_blank"
						rel="noreferrer"
						variant="contained"
						color="primary"
						onClick={handleCloseDialog}
					>
						Open page
					</CustomButton>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default ExtLinkIconBtn
