import React, { Fragment } from 'react'
import Chip from '@material-ui/core/Chip'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined'

const Chips = ({ categories, mechanics }) => {
	return (
		<Fragment>
			{categories.map((ctg) => (
				<Chip
					key={ctg.name}
					icon={<CategoryOutlinedIcon />}
					label={ctg.name}
					variant="outlined"
					color="secondary"
					size="small"
				/>
			))}

			{mechanics.map((mec) => (
				<Chip
					key={mec.name}
					icon={<SettingsOutlinedIcon />}
					label={mec.name}
					variant="outlined"
					color="primary"
					size="small"
				/>
			))}
		</Fragment>
	)
}

export default Chips
