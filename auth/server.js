const app  = require('./app');
const PORT = process.env.PORT || 4000;
const connectDatabase  = require('./config/database');
const cloudinary = require('cloudinary');

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
    console.log(`Server running`)
});

process.on(`unhandleRejection`, (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    })
})