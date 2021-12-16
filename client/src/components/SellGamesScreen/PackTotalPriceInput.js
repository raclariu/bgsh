// @ Libraries
import React from 'react'

// @ Mui
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// @ Main
const PackTotalPriceInput = ({ totalPrice, handleTotalPrice }) => {
	return (
		<TextField
			onChange={(e) => handleTotalPrice(e.target.value)}
			value={totalPrice}
			InputProps={{
				startAdornment : <InputAdornment position="start">RON</InputAdornment>
			}}
			name="pack-price"
			variant="outlined"
			label="Price for the entire pack"
			type="number"
			size="small"
			fullWidth
			required
		/>
	)
}

export default PackTotalPriceInput
