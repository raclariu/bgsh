import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined'

import { getSingleGame } from '../actions/gameActions'

import { FOR_SALE_SINGLE_GAME_RESET } from '../constants/gameConstants'

const useStyles = makeStyles((theme) => ({
	chipsBox : {
		padding        : theme.spacing(1),
		margin         : theme.spacing(1, 0, 4, 0),
		display        : 'flex',
		justifyContent : 'center',
		flexWrap       : 'wrap',
		'& > *'        : {
			margin : theme.spacing(0.5)
		}
	},
	section  : {
		padding : theme.spacing(3, 3, 3, 3)
	}
}))

const SingleGameScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const match = useRouteMatch()
	const { params: { altId } } = match

	const data = useSelector((state) => {
		return state.gamesIndex.saleData ? state.gamesIndex.saleData.find((game) => game.altId === altId) : null
	})

	const gameForSale = useSelector((state) => state.gameForSale)
	const { loading, success, error, saleData } = gameForSale

	useEffect(
		() => {
			if (!data) {
				dispatch(getSingleGame(altId))
			}

			return () => {
				dispatch({ type: FOR_SALE_SINGLE_GAME_RESET })
			}
		},
		[ dispatch, data, altId ]
	)

	return (
		<Fragment>
			{data && (
				<div>
					<Box className={cls.chipsBox}>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={data.games[0].type === 'boardgame' ? 'Boardgame' : 'Expansion'}
						/>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={data.games[0].title}
						/>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={data.games[0].bggId}
						/>
						<img src={data.games[0].thumbnail} alt={data.games[0].title} />
						<p>Year: {data.games[0].year}</p>
						<p>
							Players:{' '}
							{data.games[0].minPlayers !== data.games[0].maxPlayers ? (
								`${data.games[0].minPlayers}-${data.games[0].maxPlayers}`
							) : (
								data.games[0].maxPlayers
							)}
						</p>
						<p>Designer:{data.games[0].designers.map((designer) => designer)}</p>
						<p>SuggestedPlayers: {data.games[0].suggestedPlayers}</p>
						<p>Language Dependence: {data.games[0].languageDependence}</p>

						{data.games[0].categories.map((ctg) => (
							<Chip
								icon={<CategoryOutlinedIcon />}
								label={ctg.name}
								variant="outlined"
								color="secondary"
								size="small"
							/>
						))}

						{data.games[0].mechanics.map((mec) => (
							<Chip
								icon={<SettingsOutlinedIcon />}
								label={mec.name}
								variant="outlined"
								color="primary"
								size="small"
							/>
						))}
					</Box>
				</div>
			)}
			{success && (
				<div>
					<Box className={cls.chipsBox}>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={saleData.games[0].type === 'boardgame' ? 'Boardgame' : 'Expansion'}
						/>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={saleData.games[0].title}
						/>
						<TextField
							InputProps={{
								readOnly : true
							}}
							defaultValue={saleData.games[0].bggId}
						/>
						<img src={saleData.games[0].thumbnail} alt={saleData.games[0].title} />
						<p>Year: {saleData.games[0].year}</p>
						<p>
							Players:{' '}
							{saleData.games[0].minPlayers !== saleData.games[0].maxPlayers ? (
								`${saleData.games[0].minPlayers}-${saleData.games[0].maxPlayers}`
							) : (
								saleData.games[0].maxPlayers
							)}
						</p>
						<p>Designer:{saleData.games[0].designers.map((designer) => designer)}</p>
						<p>SuggestedPlayers: {saleData.games[0].suggestedPlayers}</p>
						<p>Language Dependence: {saleData.games[0].languageDependence}</p>

						{saleData.games[0].categories.map((ctg) => (
							<Chip
								icon={<CategoryOutlinedIcon />}
								label={ctg.name}
								variant="outlined"
								color="secondary"
								size="small"
							/>
						))}

						{saleData.games[0].mechanics.map((mec) => (
							<Chip
								icon={<SettingsOutlinedIcon />}
								label={mec.name}
								variant="outlined"
								color="primary"
								size="small"
							/>
						))}
					</Box>
				</div>
			)}
		</Fragment>
	)
}

export default SingleGameScreen
