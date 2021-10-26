// @ Libraries
import React, { useState, useEffect, Fragment } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'

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
