// @ Libraries
import React, { Fragment } from 'react'

// @ Components
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// @ Main
const Input = (props) => {
	const handleChange = (e) => {
		props.onChange(e.target.value)
	}

	return <TextField {...props} onChange={handleChange} />
}

// @ Default Props
Input.defaultProps = {
	fullWidth : true,
	required  : false,
	size      : 'small',
	variant   : 'outlined'
}

export default Input

// InputProps={{
// 	startAdornment : <InputAdornment position="start">RON</InputAdornment>
// }}
