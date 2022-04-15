module.exports = {
	apps : [
		{
			name               : 'server',
			script             : './server.js',
			error_file         : '../logs/err.log',
			out_file           : '../logs/out.log',
			log_date_format    : 'DD-MM-YYYY HH:mm:ss',
			watch              : true,
			max_memory_restart : '200M'
		}
	]
}
