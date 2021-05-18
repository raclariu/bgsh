import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList'
import DeleteIcon from '@material-ui/icons/Delete'
import { removeFromSaleList } from '../actions/gameActions'

const useStyles = makeStyles((theme) => ({
	badge   : {
		margin : theme.spacing(0, 1, 0, 0)
	},
	popover : {
		minWidth : '350px'
	}
}))

const SaleListPopover = () => {
	const cls = useStyles()

	const dispatch = useDispatch()

	const [ anchorEl, setAnchorEl ] = useState(null)

	const saleList = useSelector((state) => state.saleList)

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	return (
		<div>
			<IconButton className={cls.badge} onClick={handleClick} color="inherit">
				<Badge color="secondary" badgeContent={saleList.length}>
					<FeaturedPlayListIcon />
				</Badge>
			</IconButton>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical   : 'bottom',
					horizontal : 'center'
				}}
				transformOrigin={{
					vertical   : 'top',
					horizontal : 'right'
				}}
			>
				{/* Content */}
				{saleList && (
					<Grid container className={cls.popover} justify="flex-end">
						<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
							<List
								disablePadding
								subheader={<ListSubheader disableSticky>Sale List ({saleList.length}/5)</ListSubheader>}
							>
								{saleList.map((game) => (
									<ListItem divider key={game.bggId}>
										<ListItemAvatar>
											<Avatar variant="rounded" src={game.thumbnail} alt={game.title}>
												{game.title[0]}
											</Avatar>
										</ListItemAvatar>
										<ListItemText primary={game.title} secondary={game.year} />
										<ListItemSecondaryAction>
											<IconButton
												edge="end"
												color="secondary"
												onClick={() => removeFromSaleListHandler(game.bggId)}
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</Grid>
						{saleList.length > 0 && (
							<Grid item>
								<Button color="primary">Sell</Button>
							</Grid>
						)}
					</Grid>
				)}
			</Popover>
		</div>
	)
}

export default SaleListPopover
