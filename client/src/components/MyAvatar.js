// @ Modules
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// @ Others
import { useGetOwnAvatarQuery } from '../hooks/hooks'

// @ Styles
const StyledAvatar = styled(Avatar)(({ theme }) => ({
	backgroundColor : theme.palette.primary.main,
	imageRendering  : '-webkit-optimize-contrast'
}))

// @ Main
const MyAvatar = ({ size }) => {
	const currUsername = useSelector((state) => state.userData.username)

	const { isSuccess, data: avatarData } = useGetOwnAvatarQuery()

	return (
		<Fragment>
			{isSuccess && (
				<StyledAvatar
					sx={{
						width  : (theme) => theme.spacing(size),
						height : (theme) => theme.spacing(size)
					}}
					imgProps={{ alt: currUsername }}
					src={avatarData.avatar}
				>
					{currUsername ? currUsername.substring(0, 2).toUpperCase() : 'ME'}
				</StyledAvatar>
			)}
		</Fragment>
	)
}

export default MyAvatar
