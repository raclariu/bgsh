// @ Modules
import React, { useState, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

// @ Mui
import Popover from '@mui/material/Popover'
import ButtonGroup from '@mui/material/ButtonGroup'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'

// @ Icons
import FeaturedPlayListTwoToneIcon from '@mui/icons-material/FeaturedPlayListTwoTone'
import CloseIcon from '@mui/icons-material/Close'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomBtn from './CustomBtn'
import SaleListPopoverDialog from './SaleListPopoverDialog'

// @ Others
import { useDeleteFromListMutation, useGetListQuery } from '../hooks/hooks'

// @ Main
const SaleListPopover = () => {
	const [ anchorEl, setAnchorEl ] = useState(null)
	const [ openDialog, setOpenDialog ] = useState(false)
	const [ mode, setMode ] = useState('')

	const { isFetching, isSuccess, data } = useGetListQuery()
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
			<CustomIconBtn
				onClick={(e) => setAnchorEl(e.currentTarget)}
				disabled={isFetching}
				color="primary"
				size="large"
			>
				<Badge color="secondary" badgeContent={data && data.list.length} showZero>
					<FeaturedPlayListTwoToneIcon />
				</Badge>
			</CustomIconBtn>

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
					<Box p={2} textAlign="center" fontWeight="fontWeightMedium" color="primary.main">
						My list ({data.list.length}/8)
					</Box>
					<CustomDivider />

					<List disablePadding>
						<TransitionGroup>
							{data.list.map((game) => (
								<Collapse key={game.bggId}>
									<ListItem divider>
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
											<CustomIconBtn
												disabled={deleteMutation.isLoading}
												edge="end"
												onClick={() => deleteFromListHandler(game.bggId, game.title)}
												size="large"
												color="error"
											>
												<CloseIcon />
											</CustomIconBtn>
										</ListItemSecondaryAction>
									</ListItem>
								</Collapse>
							))}
						</TransitionGroup>
					</List>

					{data.list.length === 0 && (
						<Fragment>
							<Box my={2} textAlign="center" fontWeight="fontWeightMedium">
								Add games
							</Box>

							<Box display="flex" justifyContent="center" my={1} color="primary">
								<ButtonGroup color="primary" size="small">
									<CustomBtn component={RouterLink} to="/collection/owned" onClick={handleClose}>
										Owned
									</CustomBtn>
									<CustomBtn component={RouterLink} to="/collection/for-trade" onClick={handleClose}>
										For trade
									</CustomBtn>
									<CustomBtn component={RouterLink} to="/dashboard" onClick={handleClose}>
										Dashboard
									</CustomBtn>
								</ButtonGroup>
							</Box>
						</Fragment>
					)}

					<CustomDivider />

					{data.list.length > 0 && (
						<Box display="flex" justifyContent="flex-end" m={1}>
							{data.list.length === 1 && (
								<ButtonGroup color="primary" size="small">
									<CustomBtn component={RouterLink} to="/sell" onClick={handleClose}>
										Sell
									</CustomBtn>
									<CustomBtn component={RouterLink} to="/trade" onClick={handleClose}>
										Trade
									</CustomBtn>
									<CustomBtn component={RouterLink} to="/buy" onClick={handleClose}>
										Buy
									</CustomBtn>
									<CustomBtn component={RouterLink} to="/want" onClick={handleClose}>
										Wanted
									</CustomBtn>
								</ButtonGroup>
							)}

							{data.list.length > 1 && (
								<ButtonGroup color="primary" size="small">
									<CustomBtn onClick={() => handleModeClick('sell')}>Sell</CustomBtn>
									<CustomBtn onClick={() => handleModeClick('trade')}>Trade</CustomBtn>
									<CustomBtn onClick={() => handleModeClick('buy')}>Buy</CustomBtn>
									<CustomBtn component={RouterLink} to="/want" onClick={handleClose}>
										Wanted
									</CustomBtn>
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
