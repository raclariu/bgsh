// @ Libraries
import React, { useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// @ Icons
import FeaturedPlayListTwoToneIcon from '@mui/icons-material/FeaturedPlayListTwoTone'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

// @ Components
import SaleListPopoverDialog from './SaleListPopoverDialog'

// @ Others
import { addToSaleList } from '../actions/saleListActions'
import { useNotiSnackbar } from '../hooks/hooks'
import { useDeleteFromListMutation, useGetListQuery } from '../hooks/hooks'
import { apiGetList, apiDeleteOneFromList } from '../api/api'

// @ Main
const SaleListPopover = () => {
	const [ anchorEl, setAnchorEl ] = useState(null)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ mode, setMode ] = useState('')
	const [ showSnackbar ] = useNotiSnackbar()

	const { isLoading, isSuccess, data } = useGetListQuery()
	const deleteMutation = useDeleteFromListMutation()

	const open = Boolean(anchorEl)

	const handleClose = () => {
		setAnchorEl(null)
	}

	const deleteFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		setAnchorEl(null)
	}

	const handleModeClick = (mode) => {
		setMode(mode)
		setOpenDialog(true)
	}

	return (
		<Fragment>
			<IconButton onClick={(e) => setAnchorEl(e.currentTarget)} disabled={isLoading} color="primary" size="large">
				<Badge color="secondary" badgeContent={data && data.list.length} showZero>
					<FeaturedPlayListTwoToneIcon />
				</Badge>
			</IconButton>

			{isSuccess && (
				<Popover
					PaperProps={{
						sx : {
							width : {
								sm : 450,
								xs : '100%'
							}
						}
					}}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					transitionDuration={350}
					anchorOrigin={{
						vertical   : 'bottom',
						horizontal : 'center'
					}}
					transformOrigin={{
						vertical   : 'top',
						horizontal : 'center'
					}}
				>
					{/* Content */}
					<Box my={2} textAlign="center" fontWeight="fontWeightMedium">
						My list ({data.list.length}/6)
					</Box>
					<Divider />

					{data.list.length === 0 && (
						<Fragment>
							<Box my={2} textAlign="center" fontWeight="fontWeightMedium">
								Add games
							</Box>

							<Box display="flex" justifyContent="center" my={1} color="primary">
								<ButtonGroup color="primary" size="small">
									<Button component={RouterLink} to="/profile" onClick={handleClose}>
										Profile
									</Button>
									<Button component={RouterLink} to="/collection" onClick={handleClose}>
										Collection
									</Button>
									<Button component={RouterLink} to="/wishlist" onClick={handleClose}>
										Wishlist
									</Button>
								</ButtonGroup>
							</Box>
						</Fragment>
					)}

					<List disablePadding>
						{data.list.map((game) => (
							<ListItem key={game.bggId} divider>
								<ListItemAvatar>
									<Avatar variant="rounded" src={game.thumbnail} alt={game.title}>
										{game.title.substring(0, 2).toUpperCase()}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={game.title}
									secondary={game.year}
									primaryTypographyProps={{
										color   : 'primary',
										variant : 'subtitle2'
									}}
									secondaryTypographyProps={{
										variant : 'caption'
									}}
								/>
								<ListItemSecondaryAction>
									<IconButton
										disabled={deleteMutation.isLoading}
										edge="end"
										onClick={() => deleteFromListHandler(game.bggId, game.title)}
										size="large"
										color="error"
									>
										<HighlightOffIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>

					<Divider />

					{data.list.length > 0 && (
						<Box display="flex" justifyContent="flex-end" m={1}>
							{data.list.length === 1 && (
								<ButtonGroup color="primary" size="small">
									<Button component={RouterLink} to="/sell" onClick={handleClose}>
										Sell
									</Button>
									<Button component={RouterLink} to="/trade" onClick={handleClose}>
										Trade
									</Button>
									<Button component={RouterLink} to="/buy" onClick={handleClose}>
										Buy
									</Button>
									<Button component={RouterLink} to="/want" onClick={handleClose}>
										Wanted
									</Button>
								</ButtonGroup>
							)}

							{data.list.length > 1 && (
								<ButtonGroup color="primary" size="small">
									<Button onClick={() => handleModeClick('sell')}>Sell</Button>
									<Button onClick={() => handleModeClick('trade')}>Trade</Button>
									<Button onClick={() => handleModeClick('buy')}>Buy</Button>
									<Button component={RouterLink} to="/want" onClick={handleClose}>
										Wanted
									</Button>
								</ButtonGroup>
							)}
						</Box>
					)}

					<SaleListPopoverDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} mode={mode} />
				</Popover>
			)}
		</Fragment>
	)
}

export default SaleListPopover
