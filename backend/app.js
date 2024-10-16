const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const { ValidationError } = require('sequelize');

const app = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
	// enable cors only in development
	app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
	helmet.crossOriginResourcePolicy({
		policy: 'cross-origin',
	})
);

// Set the _csrf token and create req.csrfToken method
app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && 'Lax',
			httpOnly: true,
		},
	})
);

const routes = require('./routes');

// ...

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.title = 'Resource Not Found';
	err.errors = { message: "The requested resource couldn't be found." };
	err.status = 404;
	next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
	// check if error is a Sequelize error:
	if (err.message === `User already has a review for this spot`) {
		console.error(err);
		err.errors = {
			userIdSpotId: `Must be unique`,
		};
		err.title = 'Validation Error';
	} else if (err instanceof ValidationError) {
		let errors = {};
		for (let error of err.errors) {
			errors[error.path] = error.message;
		}
		err.title = 'Validation error';
		err.message = 'Bad Request';
		err.errors = errors;
		err.status = 400;
	}
	next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);

	if (err.status === 400) {
		return res.json({
			message: err.message,
			errors: err.errors,
			...(!isProduction && {
				title: err.title || 'Server Error',
				stack: err.stack,
			}),
		});
	}
	if (err.status === 401) {
		return res.json({
			message: err.message,
			...(!isProduction && {
				title: err.title || 'Server Error',
				errors: err.errors,
				stack: err.stack,
			}),
		});
	}
	res.json({
		message: err.message,
	});
});

module.exports = app;
