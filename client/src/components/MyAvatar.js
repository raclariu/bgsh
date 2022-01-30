// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// @ Others
import { apiGetOwnAvatar } from '../api/api'

// @ Styles
const StyledAvatar = styled(Avatar)(({ theme }) => ({
	backgroundColor : theme.palette.primary.main,
	imageRendering  : '-webkit-optimize-contrast'
}))

// @ Main
const MyAvatar = ({ size }) => {
	const username = useSelector((state) => state.userAuth.userData.username)

	const { isSuccess, data: avatarData } = useQuery([ 'ownAvatar' ], apiGetOwnAvatar, {
		staleTime : Infinity
	})

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
