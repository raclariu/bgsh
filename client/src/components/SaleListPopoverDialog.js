// @ Libraries
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

// @ Mui
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

// @ Main
const SaleListPopoverDialog = ({ openDialog, handleCloseDialog, mode }) => {
	return (
		<Fragment>
			<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle disableTypography>
					<Typography variant="h6" align="center">
						{mode === 'sell' ? 'Sell' : mode === 'trade' ? 'Trade' : 'Buy'} games individually or as a pack?
					</Typography>
				</DialogTitle>

				<DialogActions>
					<ButtonGroup color="primary">
						<Button
							onClick={handleCloseDialog}
							component={Link}
							to={mode === 'sell' ? '/sell' : mode === 'trade' ? '/trade' : '/buy'}
						>
							Individually
						</Button>
						<Button
							onClick={handleCloseDialog}
							component={Link}
							to={
								mode === 'sell' ? (
									'/sell?pack=true'
								) : mode === 'trade' ? (
									'/trade?pack=true'
								) : (
									'/buy?pack=true'
								)
							}
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
