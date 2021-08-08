// @ Libraries
import React from 'react'

// @ Mui
import TextField from '@material-ui/core/TextField'

// @ Main
const PackInfoTextarea = ({ extraInfoPack, handleExtraInfoPack }) => {
	return (
		<TextField
			value={extraInfoPack}
			onChange={(e) => handleExtraInfoPack(e.target.value)}
			inputProps={{
				maxLength   : 500,
				placeholder : 'Any other info regarding the pack goes in here (500 characters limit)'
			}}
			variant="outlined"
			name="extra-info-pack"
			type="text"
			multiline
			rows={3}
			rowsMax={10}
			size="small"
			fullWidth
		/>
	)
}

export default PackInfoTextarea
