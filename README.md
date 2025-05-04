
---

## 🏕️ YelpCamp

YelpCamp is a full-stack web application where users can view, create, and review campgrounds. It features secure user authentication, geocoding, clustering maps, data validation, and a clean UI. This project is inspired by Colt Steele’s Web Developer Bootcamp, modified and extended with MapTiler support, MongoDB Atlas, and sanitization best practices.

---

### 🚀 Features

* User authentication (register/login/logout)
* CRUD operations for campgrounds and reviews
* Clustered map integration using MapTiler SDK
* MongoDB Atlas for cloud database
* Form data validation using Joi + HTML sanitization
* Flash messages and error handling
* RESTful routing and MVC structure
* Image uploads via Cloudinary
* Responsive Bootstrap styling

---

### 🧑‍💻 Technologies Used

* **Frontend**: EJS, Bootstrap, Vanilla JS
* **Backend**: Node.js, Express.js, MongoDB
* **Authentication**: Passport.js (Local Strategy)
* **Validation & Security**: Joi, sanitize-html, express-mongo-sanitize, helmet
* **Mapping**: MapTiler SDK
* **Uploads**: Multer, Cloudinary
* **Deployment**: Render / Railway / Vercel Backend

---

### 🌍 Environment Variables (add to `.env`)

```
MAPTILER_API_KEY=your_maptiler_api_key
DB_URL=your_mongo_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
SESSION_SECRET=your_random_secret
```

---

### 🛠️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp

# Install dependencies
npm install

# Run MongoDB locally or connect to Mongo Atlas
# Add your environment variables in a .env file

# Seed the database (optional)
node seeds/index.js

# Start the server
npm run dev
```

---

## 📦 Deployment Checklist

✅ Use `helmet()` for HTTP headers
✅ Enable `express-mongo-sanitize()` after ensuring `req.query` is safe
✅ Set `NODE_ENV=production`
✅ Hide your `.env` file using `.gitignore`
✅ Use a production DB (MongoDB Atlas)
✅ Use secure cookie settings in production
✅ Add error boundaries and catch async errors
✅ Minify JS and CSS if bundling
✅ Use CDN for static resources (Bootstrap/MapTiler)

---
