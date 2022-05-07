// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'

// @ Components
import Input from './Input'
import CustomIconBtn from './CustomIconBtn'
import CustomBtn from './CustomBtn'
import LoadingBtn from './LoadingBtn'

// @ Main
const EditListedGameBtn = ({ currPrice, bggId, currExtraInfo }) => {
	const [ open, setOpen ] = useState(false)
	const [ price, setPrice ] = useState(currPrice)
	const [ extraInfo, setExtraInfo ] = useState(currExtraInfo || '')

	const handleDialogOpen = () => {
		setOpen(true)
	}

	const handleDialogClose = () => {
		setOpen(false)
	}

	const handlePriceChange = (inputVal) => {
		setPrice(inputVal)
	}

	const handleExtraInfoChange = (inputVal) => {
		setExtraInfo(inputVal)
	}

	return (
		<Fragment>
			<CustomIconBtn onClick={handleDialogOpen} size="large" color="primary">
				<EditTwoToneIcon />
			</CustomIconBtn>

			<Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
				<DialogTitle>Edit listing</DialogTitle>

				<DialogContent dividers>
					<Input
						onChange={(inputVal) => handlePriceChange(inputVal)}
						value={price}
						name={`price-${bggId}`}
						label="Price"
						type="number"
						fullWidth
						required
						InputProps={{
							startAdornment : <InputAdornment position="start">RON</InputAdornment>
						}}
					/>

					<Input
						sx={{ my: 2 }}
						value={extraInfo}
						onChange={(inputVal) => handleExtraInfoChange(inputVal)}
						inputProps={{
							maxLength   : 500,
							placeholder : 'Any other info goes in here (500 characters limit)'
						}}
						label={`Extra info ${extraInfo.length}/500`}
						name="extra-info-txt"
						type="text"
						size="medium"
						multiline
						minRows={3}
						maxRows={10}
						fullWidth
					/>
				</DialogContent>

				<DialogActions>
					<CustomBtn onClick={handleDialogClose}>Cancel</CustomBtn>
					<LoadingBtn variant="contained">Update</LoadingBtn>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default EditListedGameBtn
