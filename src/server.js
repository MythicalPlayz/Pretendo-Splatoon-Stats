process.title = 'Pretendo - Splatoon Website';

const express = require('express')
const handlebars = require('express-handlebars');
const {engine} = handlebars
const logger = require('./logger');
const path = require('path');
const app = express()
const port = 3000

logger.info('Setting up static public folder');
app.use(express.static('public'));

app.engine('handlebars', engine({
	helpers: {
		doFaq(value, options) {
			let htmlLeft = '';
			let htmlRight = '';
			for (const [i, v] of Object.entries(value)) {
				const appendHtml = options.fn({
					...v
				}); // Tis is an HTML string
				if (i % 2 === 0) {
					htmlLeft += appendHtml;
				} else {
					htmlRight += appendHtml;
				}
			}
			return `
			<div class="left questions-left">
				${htmlLeft}
			</div>
			<div class="right questions-right">
				${htmlRight}
			</div>
			`;
		},
		eq(value1, value2) {
			return value1 === value2;
		},
		neq(value1, value2) {
			return value1 !== value2;
		},
		slug(string) {
			return string.toLowerCase().replaceAll(/ /g, '-');
		}
	}
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

const routes = {
	home: require("./routes/home")
} 

app.use('/', routes.home);

app.listen(port, () => {
  logger.success(`Website up on ${port}`)
})