import React from 'react'
import Pagination from '@material-ui/lab/Pagination'

const Paginate = ({ pagination, handleFilters }) => {
	const onPageChangeHandler = (e, page) => {
		window.scrollTo(0, 0)
		handleFilters(page, 'page')
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
