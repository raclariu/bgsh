// @ Libraries
import React, { Fragment } from 'react'
import Chip from '@mui/material/Chip'

// @ Icons
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'

// @ Main
const Chips = ({ categories, mechanics }) => {
	return (
		<Fragment>
			{categories.map((ctg) => (
				<Chip key={ctg.id} icon={<CategoryOutlinedIcon />} label={ctg.name} color="secondary" size="small" />
			))}

			{mechanics.map((mec) => (
				<Chip key={mec.id} icon={<SettingsOutlinedIcon />} label={mec.name} color="primary" size="small" />
			))}
		</Fragment>
	)
}

export default Chips
