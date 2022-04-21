// @ Modules
import React from 'react'

// @ Mui
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

// @ Main
const ChangelogScreen = () => {
	return (
		<Box>
			<Box textAlign="center" fontSize="h4.fontSize" fontWeight="bold" mb={5}>
				Changelog
			</Box>
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
				<Box component={Paper} p={2} boxShadow={1} borderRadius="4px">
					<Box ml={3} component="p" fontSize="h5.fontSize" fontWeight="fontWeightMedium">
						22 aprilie 2022
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
