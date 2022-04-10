// @ Modules
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

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
import { useUpdateSaveGameStatusMutation, useGetSaveGameStatusQuery } from '../hooks/hooks'

// @ Main
const SaveGameButton = ({ altId, addedById }) => {
	const currUserId = useSelector((state) => state.userData._id)

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
				<CustomTooltip title={data.isSaved ? 'Unsave' : 'Save'}>
					<Checkbox
						sx={{
							height          : 48,
							width           : 48,
							color           : 'primary.main',
							'&.Mui-checked' : {
								color : 'secondary.main'
							}
						}}
						disabled={addedById && addedById.toString() === currUserId.toString()}
						id="save-button"
						onChange={saveGameHandler}
						icon={<FavoriteBorder />}
						checkedIcon={<Favorite />}
						name="saved"
						checked={data.isSaved}
					/>
				</CustomTooltip>
			)}
		</Fragment>
	)
}

export default SaveGameButton
