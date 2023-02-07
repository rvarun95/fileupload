const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../model/file');
const Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

Router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        title,
        description,
        file_path: path,
        file_mimetype: mimetype
      });
      await file.save();
      res.send('file uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

/* update document */
Router.put('/update/:id', upload.single('file'), async (req, res) => {
    console.log('++++++&&&&&&&&&&&&&&')
    try {
      const { title, description } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        title,
        description,
        file_path: path,
        file_mimetype: mimetype
      });
      // await File.findOneAndUpdate(req.params.id,
      //   {$set:file})
      // await File.findOneAndUpdate(req.params.id, {$set: {file}}, {upsert: true}, function(err,doc) {
      //     if (err) { throw err; }
      //     else { console.log("Updated"); }
      //   });  
      console.log('++++++' + file)
      const file1 = await File.findOne({'_id': req.params.id}, {$set: file});
      console.log('file: ', file1)
      res.send('file updated successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

Router.get('/getAllFiles', async (req, res) => {
  try {
    const files = await File.find({});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

Router.get('/getFileById/:id', async (req, res) => {
  try {
    const file = await File.findOne({'_id': req.params.id});
    console.log('***********' + file)
    res.send(file);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

Router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.delete('/delete/:id', async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, msg: 'File Deleted Successfully' });
  } catch (error) {
    res.status(400).send('Error while deleting the file. Try again later.');
  }
});

module.exports = Router;