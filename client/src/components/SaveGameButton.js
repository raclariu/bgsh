// @ Modules
import React, { Fragment } from 'react'

// @ Mui
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'

// @ Components
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import Loader from './Loader'

// @ Others
import { useNotiSnackbar, useUpdateSaveGameStatusMutation, useGetSaveGameStatusQuery } from '../hooks/hooks'

// @ Main
const SaveGameButton = ({ altId, addedById }) => {
	const { isFetching, data, isSuccess } = useGetSaveGameStatusQuery({ altId })

	const updateSaveStatusMutation = useUpdateSaveGameStatusMutation()
	const saveGameHandler = () => {
		updateSaveStatusMutation.mutate(altId)
	}

	return (
		<Fragment>
			{isFetching && (
				<CustomIconBtn disabled disableRipple size="large">
					<Loader size={20} />
				</CustomIconBtn>
			)}

			{isSuccess &&
			!isFetching && (
				// disabled={addedById === userId}

				<CustomTooltip title={data.isSaved ? 'Unsave' : 'Save'}>
					<Checkbox
						sx={{
							height : '44px',
							width  : '44px'
						}}
						color="secondary"
						id="save-button"
						onChange={saveGameHandler}
						icon={<FavoriteBorder fontSize="small" />}
						checkedIcon={<Favorite fontSize="small" />}
						name="saved"
						checked={data.isSaved}
					/>
				</CustomTooltip>
			)}
		</Fragment>
	)
}

export default SaveGameButton
