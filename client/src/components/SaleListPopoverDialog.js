import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

const SaleListPopoverDialog = ({ openDialog, handleCloseDialog, mode }) => {
	return (
		<Fragment>
			<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle disableTypography>
					<Typography variant="h6" align="center">
						{mode === 'sell' ? 'Sell' : 'Trade'} games individually or as a pack?
					</Typography>
				</DialogTitle>

				<DialogActions>
					<ButtonGroup color="primary">
						<Button onClick={handleCloseDialog} component={Link} to={mode === 'sell' ? '/sell' : '/trade'}>
							Individually
						</Button>
						<Button
							onClick={handleCloseDialog}
							component={Link}
							to={mode === 'sell' ? '/sell?type=pack' : '/trade?type=pack'}
						>
							Pack
						</Button>
					</ButtonGroup>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default SaleListPopoverDialog
