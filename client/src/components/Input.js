// @ Libraries
import React from 'react'

// @ Components
import TextField from '@mui/material/TextField'

// @ Main
const Input = ({ onChange: propsOnChange, ...other }) => {
	return <TextField onChange={(e) => propsOnChange(e.target.value)} {...other} />
}

// @ Default Props
Input.defaultProps = {
	required : false,
	size     : 'small',
	variant  : 'outlined'
}

export default Input
