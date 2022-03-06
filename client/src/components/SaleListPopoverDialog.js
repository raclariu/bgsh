// @ Modules
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

// @ Mui
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// @ Components
import CustomButton from './CustomButton'

// @ Main
const SaleListPopoverDialog = ({ openDialog, handleCloseDialog, mode }) => {
	return (
		<Fragment>
			<Dialog fullWidth open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
				<DialogTitle>
					<Box textAlign="center">
						{`${mode === 'sell'
							? 'Sell'
							: mode === 'trade'
								? 'Trade'
								: mode === 'buy' ? 'Buy' : 'Auction'} games individually or as a pack?`}
					</Box>
				</DialogTitle>

				<DialogActions>
					<ButtonGroup color="primary">
						<CustomButton
							onClick={handleCloseDialog}
							component={Link}
							to={
								mode === 'sell' ? (
									'/sell'
								) : mode === 'trade' ? (
									'/trade'
								) : mode === 'buy' ? (
									'/buy'
								) : (
									'/auction'
								)
							}
						>
							Individually
						</CustomButton>
						<CustomButton
							onClick={handleCloseDialog}
							component={Link}
							to={
								mode === 'sell' ? (
									'/sell?pack=true'
								) : mode === 'trade' ? (
									'/trade?pack=true'
								) : mode === 'buy' ? (
									'/buy?pack=true'
								) : (
									'/auction?pack=true'
								)
							}
						>
							Pack
						</CustomButton>
					</ButtonGroup>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default SaleListPopoverDialog
