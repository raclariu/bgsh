// @ Libraries
import React, { Fragment } from 'react'
import LazyLoad from 'react-lazyload'

// @ Mui
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const GalleryImage = () => {
	return (
		<Fragment>
			<Box
				display="flex"
				justifyContent="center"
				height="220px"
				width="100%"
				bgcolor="background.paper"
				borderRadius={4}
				boxShadow={2}
				p={2}
			>
				<LazyLoad offset={200} once>
					<img
						onClick={() => handleOpen(index)}
						className={cls.galleryImg}
						src={obj.thumbnail}
						alt={obj.caption}
					/>
				</LazyLoad>
			</Box>

			<Dialog maxWidth={false} open={open} onClose={handleClose}>
				<DialogTitle disableTypography>
					<Typography variant="subtitle2">{gallery[imgIndex].caption}</Typography>
				</DialogTitle>

				<DialogContent dividers>
					<Box maxWidth="100%">
						<img
							onLoad={onImgLoad}
							className={cls.gallery}
							alt={gallery[imgIndex].caption}
							src={gallery[imgIndex].image}
						/>
						{!load && <Loader />}
					</Box>
				</DialogContent>

				<DialogActions>
					<Button
						color="secondary"
						href={`https://boardgamegeek.com${gallery[imgIndex].extLink}`}
						target="_blank"
						rel="noopener"
					>
						See on BGG
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	)
}

export default GalleryImage
