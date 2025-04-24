const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log('Cloudinary config:', cloudinary.config());


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'YelpCamp',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

module.exports = {
    cloudinary,
    storage,
};