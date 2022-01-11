// @ Libraries
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import AvatarEditor from 'react-avatar-editor'
import { useDebounce } from 'use-debounce'
import { alpha } from '@mui/material/styles'
import { useMutation } from 'react-query'

// @ Mui
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// @ Icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'

// @ Others
import { apiUserChangeAvatar } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Styles
const MyAvatar = styled(Avatar)(({ theme }) => ({
	width           : theme.spacing(16),
	height          : theme.spacing(16),
	backgroundColor : theme.palette.primary.main,
	transition      : 'background 0.5s',
	cursor          : 'pointer',
	'&:hover'       : {
		backgroundColor : 'rgba(0, 0, 0, 0.7)',
		color           : 'rgba(0, 0, 0, 0.7)'
	}
}))

const FileInput = styled('input')({
	display : 'none'
})

const ChangeAvatar = () => {
	const { userData } = useSelector((state) => state.userAuth)

	const ref = useRef()
	const [ image, setImage ] = useState(null)
	const [ zoom, setZoom ] = useState(1.2)
	const [ pos, setPos ] = useState({ x: 0.5, y: 0.5 })
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ showSnackbar ] = useNotification()
	const [ url, setUrl ] = useState('')

	const mutation = useMutation((imgBlob) => apiUserChangeAvatar(imgBlob), {
		onSuccess : () => {
			setOpenDialog(false)
			setImage(null)
			showSnackbar.success({ text: 'Avatar changed successfully' })
		}
	})

	console.log(mutation)

	useEffect(
		() => {
			if (image) {
				console.log(image)
				setOpenDialog(true)
			}
		},
		[ image ]
	)

	const handleImageChange = (e) => {
		const uploadedImg = e.target.files[0]
		if (uploadedImg) {
			setPos({ x: 0.5, y: 0.5 })
			setZoom(1.2)
		}

		uploadedImg ? setImage(uploadedImg) : setImage(null)
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
		e.preventDefault()
		ref.current.getImageScaledToCanvas().toBlob(
			(blob) => {
				if (blob.size > 102400) {
					showSnackbar.error({ text: 'Image too large. Maximum size is 100 kb' })
					return
				}

				const fd = new FormData()
				fd.append('avatar', blob, image.name)

				mutation.mutate(fd)
			},
			'image/jpeg',
			0.95
		)
	}

	return (
		<Fragment>
			<label htmlFor="avatar">
				<FileInput
					accept="image/*"
					id="avatar"
					name="avatar"
					type="file"
					onChange={handleImageChange}
					onClick={(e) => (e.target.value = null)}
				/>
				<MyAvatar src={userData.avatar}>
					<PhotoCameraIcon fontSize="large" />
				</MyAvatar>
			</label>

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
					<Button onClick={handleSubmit}>Change avatar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default ChangeAvatar
