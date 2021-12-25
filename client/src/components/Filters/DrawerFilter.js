// @ Libraries
import React, { useState, useEffect, Fragment } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'

// @ Mui

// @ Main
const DrawerFilter = () => {
	const [ open, setOpen ] = useState(false)

	return (
		<Fragment>
			<Button variant="contained" color="primary" onClick={() => setOpen(true)}>
				Open filters
			</Button>
			<Drawer variant="temporary" anchor="bottom" open={open} onClose={() => setOpen(false)}>
				asd
			</Drawer>
		</Fragment>
	)
}

export default DrawerFilter
