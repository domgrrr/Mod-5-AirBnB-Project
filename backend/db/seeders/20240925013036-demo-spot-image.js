'use strict';
const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await SpotImage.bulkCreate(
			[
				{
					spotId: 1,
					url: 'https://i.ibb.co/5vcx2QW/App-Academy.jpg',
					preview: true,
				},
				{
					spotId: 1,
					url: 'https://i.ibb.co/N3rZ8D7/Beach-House.png',
					preview: false,
				},
				{
					spotId: 3,
					url: 'https://i.ibb.co/x36KRq3/Mountain-Retreat.jpg',
					preview: true,
				},
				{
					spotId: 4,
					url: 'https://i.ibb.co/tLqFQ27/City-Loft.jpg',
					preview: true,
				},
        {
          spotId: 5,
          url: 'https://i.ibb.co/F3C25vz/NYC-Apartment.png',
          preview: true,
        },
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = 'SpotImages';
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				url: {
					[Op.in]: [
						'https://example.com/spot1_image1.jpg',
						'https://example.com/spot1_image2.jpg',
						'https://example.com/spot2_image1.jpg',
						'https://example.com/spot3_image1.jpg',
					],
				},
			},
			{}
		);
	},
};
