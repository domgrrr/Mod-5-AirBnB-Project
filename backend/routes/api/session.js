const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Log in
const validateLogin = [
	check('credential')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage('Email or username is required'),
	check('password')
		.exists({ checkFalsy: true })
		.withMessage('Password is required'),
	handleValidationErrors,
];

router.post('/', validateLogin, async (req, res, next) => {
	const { credential, password } = req.body;

	if (!credential || !password) {
		const err = new Error('Login failed');
		err.status = 400;
		err.title = 'Login failed';
		err.message = 'Bad Request';
		if (!credential)
			err.errors = { credential: 'Email or username is required' };
		if (!password) err.errors = { password: 'Password is required' };
		return next(err);
	}
	const user = await User.unscoped().findOne({
		where: {
			[Op.or]: {
				username: credential,
				email: credential,
			},
		},
	});

	if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
		const err = new Error('Login failed');
		err.status = 401;
		err.title = 'Login failed';
		err.errors = { credential: 'The provided credentials were invalid.' };
		err.message = 'Invalid credentials';
		return next(err);
	}

	const safeUser = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		username: user.username,
	};

	await setTokenCookie(res, safeUser);

	return res.json({
		user: safeUser,
	});
});

// Log out
router.delete('/', (_req, res) => {
	res.clearCookie('token');
	return res.json({ message: 'success' });
});

// Restore session user
router.get('/', (req, res) => {
	const { user } = req;
	if (user) {
		const safeUser = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			username: user.username,
		};
		return res.json({
			user: safeUser,
		});
	} else return res.json({ user: null });
});

module.exports = router;
