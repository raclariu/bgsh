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
import { useNotiSnackbar, useUpdateSaveGameStatusMutation, useGetSaveGameStatusQuery } from '../hooks/hooks'

// @ Main
const SaveGameButton = ({ altId, addedById }) => {
	const { userData } = useSelector((state) => state.userAuth)

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
							height : '44px',
							width  : '44px'
						}}
						disabled={addedById && addedById.toString() === userData._id.toString()}
						color={data.isSaved ? 'secondary' : 'primary'}
						id="save-button"
						onChange={saveGameHandler}
						icon={<FavoriteBorder color="primary" fontSize="small" />}
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
