// @ Modules
import React from 'react'
import { useNavigate } from 'react-router-dom'

// @ Mui
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

// @ Icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import KeyboardAltTwoToneIcon from '@mui/icons-material/KeyboardAltTwoTone'

// @ Components
import CustomIconBtn from '../components/CustomIconBtn'

// @ Main
const ChangelogScreen = () => {
	const navigate = useNavigate()

	return (
		<Box display="flex" flexDirection="column" gap={2}>
			<Box display="flex" alignItems="center" gap={2} mb={2}>
				<CustomIconBtn color="primary" onClick={() => navigate('/')} size="large" edge="start">
					<HomeTwoToneIcon />
				</CustomIconBtn>
				<Box ml={2} fontSize="h4.fontSize" fontWeight="bold">
					Changelog
				</Box>
			</Box>

			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
				<Box component={Paper} p={2} boxShadow={1} borderRadius="4px">
					<Box ml={3} component="p" fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						23 aprilie 2022
					</Box>
					<ul style={{ fontSize: 14, lineHeight: 1.7 }}>
						<li>
							<span style={{ fontWeight: 'bold', color: '#ff3d00' }}>NEW FEATURE:</span> importul
							colectiei din BGG aduce pe langa cele owned si wishlist si pe cele din for trade, want in
							trade, want to buy si want to play
						</li>
						<li>click pe thumbnail la listari ruteaza acum la pagina detaliata a listarii</li>
						<li>in meniu, avatarul de sus acum ruteaza la pagina de profil a utilizatorului</li>
						<li>paginare mai buna pe mobil si extra detalii sub paginare</li>
						<li>rezolvare rank care arata N/A in loc de rank pentru listari</li>
						<li>adaugare pagina Changelog (footer)</li>
						<li>
							zeci de mici sau mai mari schimbari de design/culori/marime font etc. pentru ambele teme
						</li>
						<li>multiple mici 🐛 rezolvate</li>
					</ul>
				</Box>
			</Box>

			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
				<Box component={Paper} p={2} boxShadow={1} borderRadius="4px">
					<Box ml={3} component="p" fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						19 aprilie 2022
					</Box>
					<ul style={{ fontSize: 14, lineHeight: 1.7 }}>
						<li>text mai mare la extra info in pagina listarii</li>
						<li>diversitate butoane pe Homepage pentru cand esti logat</li>
						<li>
							poti opta pentru a primi email cand primesti un mesaj nou. Opteaza pe pagina Settings, jos
							de tot (posibil ca mailurile sa intre la Promotions in Gmail)
						</li>
						<li>click pe imagini in Homepage la New Listings pentru a te duce direct la listare</li>
						<li>diverse schimbari de design si 🐛 fixing</li>
					</ul>
				</Box>
			</Box>
		</Box>
	)
}

export default ChangelogScreen
