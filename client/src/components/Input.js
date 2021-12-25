// @ Libraries
import React from 'react'

// @ Components
import TextField from '@mui/material/TextField'

// @ Main
const Input = (props) => {
	return <TextField {...props} />
}

// @ Default Props
Input.defaultProps = {
	required : false,
	size     : 'small',
	variant  : 'outlined'
}

export default Input

// InputProps={{
// 	startAdornment : <InputAdornment position="start">RON</InputAdornment>
// }}
