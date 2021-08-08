// @ Libraries
import React from 'react'

// @ Mui
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// @ Main
const PackPriceInput = ({ packPrice, handlePackPrice }) => {
	return (
		<TextField
			onChange={(e) => handlePackPrice(e.target.value)}
			value={packPrice}
			InputProps={{
				startAdornment : <InputAdornment position="start">RON</InputAdornment>
			}}
			inputProps={{
				min : 0,
				max : 10000
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

export default PackPriceInput
