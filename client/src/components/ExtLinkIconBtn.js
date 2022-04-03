// @ Modules
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
const ExtLinkIconBtn = ({ url, tooltip = 'See on BGG' }) => {
	const [ openDialog, setOpenDialog ] = useState(false)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<Fragment>
			<CustomTooltip title={tooltip}>
				<CustomIconBtn onClick={handleOpenDialog} color="primary" size="large">
					<LaunchIcon />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle>
					<Box textAlign="center">Follow external link?</Box>
					<Box
						textAlign="center"
						color="text.secondary"
						fontSize={12}
						fontStyle="italic"
						sx={{ wordBreak: 'break-word' }}
					>
						{url}
					</Box>
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
