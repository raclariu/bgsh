// @ Libraries
import React, { Fragment } from 'react'

// @ Components
import TextField from '@mui/material/TextField'

// @ Main
const Input = ({ onChange: propsOnChange, ...other }) => {
	return (
		<Fragment>
			{propsOnChange ? (
				<TextField onChange={(e) => propsOnChange(e.target.value)} {...other} />
			) : (
				<TextField {...other} />
			)}
		</Fragment>
	)
}

// @ Default Props
Input.defaultProps = {
	required : false,
	size     : 'small',
	variant  : 'outlined'
}

export default Input
