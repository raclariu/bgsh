// @ Modules
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import AvatarEditor from 'react-avatar-editor'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// @ Components
import LoadingBtn from './LoadingBtn'

// @ Icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'

// @ Others
import { useNotiSnackbar, useGetOwnAvatarQuery, useChangeOwnAvatarMutation } from '../hooks/hooks'

// @ Styles
const MyAvatar = styled(Avatar)(({ theme }) => ({
	backgroundColor : theme.palette.primary.secondary,
	width           : theme.spacing(14),
	height          : theme.spacing(14),
	imageRendering  : '-webkit-optimize-contrast',
	transition      : 'background 0.35s',
	cursor          : 'pointer',
	'&:hover'       : {
		backgroundColor : theme.palette.grey[500],
		color           : theme.palette.grey[500]
	}
}))

const FileInput = styled('input')({
	display : 'none'
})

const ChangeAvatar = () => {
	const { isSuccess, data: ownAvatarData } = useGetOwnAvatarQuery()

	const ref = useRef()
	const [ image, setImage ] = useState(null)
	const [ zoom, setZoom ] = useState(1.2)
	const [ pos, setPos ] = useState({ x: 0.5, y: 0.5 })
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ showSnackbar ] = useNotiSnackbar()

	const mutation = useChangeOwnAvatarMutation({
		changeState : () => {
			setOpenDialog(false)
			setImage(null)
		}
	})

	useEffect(
		() => {
			if (image) {
				setOpenDialog(true)
			}
		},
		[ image ]
	)

	const handleImageChange = (e) => {
		const uploadedImg = e.target.files[0]
		if (!uploadedImg) return

		if (uploadedImg.type !== 'image/jpeg' && uploadedImg.type !== 'image/png') {
			showSnackbar.error({ text: 'Only .jpg and .png images are allowed' })
			setImage(null)
			return
		}

		if (uploadedImg.size > 7 * 1024 * 1024) {
			showSnackbar.error({ text: 'Image too large. Maximum size is 7MB' })
			setImage(null)
			return
		}

		if (uploadedImg) {
			setPos({ x: 0.5, y: 0.5 })
			setZoom(1.2)
		}

		setImage(uploadedImg)
	}

	const handleZoomSlider = (e, newValue) => {
		setZoom(newValue)
	}

	const handlePosChange = (newPos) => {
		setPos(newPos)
	}

	const handleCloseDialog = () => {
		setImage(null)
		setOpenDialog(false)
	}

	const handleSubmit = (e) => {
		if (image.type === 'image/jpeg') {
			ref.current.getImageScaledToCanvas().toBlob(
				(blob) => {
					const fd = new FormData()
					fd.append('avatar', blob, image.name)

					mutation.mutate(fd)
				},
				'image/jpeg',
				0.95
			)
		} else if (image.type === 'image/png') {
			ref.current.getImageScaledToCanvas().toBlob((blob) => {
				const fd = new FormData()
				fd.append('avatar', blob, image.name)

				mutation.mutate(fd)
			})
		} else {
			showSnackbar.error({ text: 'Only .jpg and .png images are allowed' })
			setImage(null)
			return
		}
	}

	return (
		<Fragment>
			{isSuccess && (
				<label htmlFor="avatar">
					<FileInput
						accept="image/jpeg, image/png"
						id="avatar"
						name="avatar"
						type="file"
						onChange={handleImageChange}
						onClick={(e) => (e.target.value = null)}
					/>
					<MyAvatar src={ownAvatarData.avatar}>
						<PhotoCameraIcon color="primary" fontSize="large" />
					</MyAvatar>
				</label>
			)}

			<Dialog maxWidth="xs" open={openDialog} onClose={handleCloseDialog} disableEscapeKeyDown>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2}>
						<AvatarEditor
							ref={ref}
							image={image}
							onPositionChange={handlePosChange}
							position={pos}
							width={250}
							height={250}
							borderRadius={150}
							color={[ 0, 0, 0, 0.6 ]} // RGBA
							scale={zoom}
						/>
						<Box display="flex" alignItems="center" gap={1}>
							<ZoomOutIcon color="primary" />

							<Slider value={zoom} min={1} max={5} step={0.1} onChange={handleZoomSlider} />

							<ZoomInIcon color="primary" />
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<LoadingBtn onClick={handleSubmit} variant="outlined" color="primary" loading={mutation.isLoading}>
						Change avatar
					</LoadingBtn>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default ChangeAvatar
