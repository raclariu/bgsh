// @ Libraries
import React, { Fragment } from 'react'
import Chip from '@material-ui/core/Chip'

// @ Icons
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined'

// @ Main
const Chips = ({ categories, mechanics }) => {
	return (
		<Fragment>
			{categories.map((ctg) => (
				<Chip key={ctg.name} icon={<CategoryOutlinedIcon />} label={ctg.name} color="secondary" size="small" />
			))}

			{mechanics.map((mec) => (
				<Chip key={mec.name} icon={<SettingsOutlinedIcon />} label={mec.name} color="primary" size="small" />
			))}
		</Fragment>
	)
}

export default Chips
