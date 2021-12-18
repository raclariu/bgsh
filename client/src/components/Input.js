// @ Libraries
import React, { Fragment } from 'react'

// @ Components
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// @ Main
const Input = ({ type, value, handler, label, name, required, fullWidth, size }) => {
	return (
		<Fragment>
			{type === 'number' && (
				<TextField
					onChange={(e) => handler(e.target.value)}
					value={value}
					InputProps={{
						startAdornment : <InputAdornment position="start">RON</InputAdornment>
					}}
					name={name}
					variant="outlined"
					label={label}
					type="number"
					size={size}
					fullWidth={fullWidth}
					required={required}
				/>
			)}
		</Fragment>
	)
}

// @ Default Props
Input.defaultProps = {
	fullWidth : true,
	required  : false,
	size      : 'small'
}

export default Input
