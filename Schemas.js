const BaseJoi = require('joi'); // <-- You missed this line
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.noHtml': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error('string.noHtml', { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);


// Define the schema for the request body
module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
})

// to prevent empty review submission in server side
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})