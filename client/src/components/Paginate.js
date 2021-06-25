import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Pagination from '@material-ui/lab/Pagination'

const Paginate = ({ pagination, searchKeyword }) => {
	const history = useHistory()
	const location = useLocation()

	const onPageChangeHandler = (e, page) => {
		window.scrollTo(75, 75)

		if (searchKeyword) {
			history.push(`${location.pathname}?search=${searchKeyword}&page=${page}`)
		} else {
			history.push(`${location.pathname}?page=${page}`)
		}
	}

	return (
		<div>
			{pagination.totalPages > 1 && (
				<Pagination
					page={pagination.page}
					onChange={(e, page) => onPageChangeHandler(e, page)}
					count={pagination.totalPages}
					color="primary"
				/>
			)}
		</div>
	)
}

export default Paginate
