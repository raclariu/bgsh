// @ Libraries
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
	const username = useSelector((state) => state.userAuth.userData.username)

	const { isSuccess, data: avatarData } = useGetOwnAvatarQuery()

	return (
		<Fragment>
			{isSuccess && (
				<StyledAvatar
					sx={{
						width  : (theme) => theme.spacing(size),
						height : (theme) => theme.spacing(size)
					}}
					imgProps={{ alt: username }}
					src={avatarData.avatar}
				>
					<Box fontSize={12}>{username ? username.substring(0, 2).toUpperCase() : 'XX'}</Box>
				</StyledAvatar>
			)}
		</Fragment>
	)
}

export default MyAvatar
