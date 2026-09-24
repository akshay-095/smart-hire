const multer = require('multer');
const path = require('path');

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Save files here
    },
    filename: function (req, file, cb) {
        // Name the file: userId-timestamp.ext (e.g., 609d7a-163456.pdf)
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, req.session.user.id + '-' + uniqueSuffix);
    }
});

// Initialize Upload
const upload = multer({ storage: storage });

module.exports = upload;