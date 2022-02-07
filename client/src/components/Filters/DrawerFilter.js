// @ Libraries
import React, { useState, useEffect, Fragment } from 'react'

// @ Mui
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'

// @ Components
import CustomButton from '../CustomButton'

// @ Main
const DrawerFilter = () => {
	const [ open, setOpen ] = useState(false)

	return (
		<Fragment>
			<CustomButton variant="contained" color="primary" onClick={() => setOpen(true)}>
				Open filters
			</CustomButton>
			<Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
				asd
			</Drawer>
		</Fragment>
	)
}

export default DrawerFilter
