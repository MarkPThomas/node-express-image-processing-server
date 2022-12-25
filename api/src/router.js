const { Router } = require('express');
const multer = require('multer');
const path = require('path');


const router = Router();

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};

const storage = multer.diskStorage({
  destination: 'api/uploads/',
  filename: filename
});


const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'))
  } else {
    callback(null, true);
  }
};

const upload = multer({ fileFilter: fileFilter, storage: storage });

router.post('/upload', upload.single('photo'), (req, res) => {
  if (req.fileValidationError !== undefined) {
    return res.status(400).json({ error: req.fileValidationError });
  } else {
    res.status(201).json({ success: true });
  }
})

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');
router.get('/photo-viewer', (req, res) => {
  res.sendFile(photoPath);
})

module.exports = router;