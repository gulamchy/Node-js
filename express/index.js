const express   = require('express');
const multer    = require('multer');
const path      = require('path');

const UPLOAD_FOLDER = "./uploads/";

const storage   = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                            .replace(fileExt, "")
                            .toLowerCase()
                            .split(" ")
                            .join("-") + "-" + Date.now();
        cb(null, fileName+fileExt);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if(file.fieldname === 'avatar'){
            if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(new Error("Only .jpg, .png or .jpeg allowed!"));
            }
        }
        else if(file.fieldname === 'doc') {
            if(file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(new Error("Only .pdf allowed!"));
            }
        }
    }
});

const app = express();

// Single Upload
// app.post('/', upload.single("avatar"), (req, res) =>{
//     res.send('Successfully Uploaded');
// });

// Multi Upload
// app.post('/', upload.array("avatar", 3), (req, res) =>{
//     res.send('Successfully Uploaded');
// });

// MultiFiles upload
// app.post('/', upload.fields([
//     {name: "avatar", maxCount: 1},
//     {name: "gallery", maxCount: 3}
// ]), (req, res) =>{
//     res.send('Successfully Uploaded');
// });

// Single Upload - extended
// app.post('/', upload.single("avatar"), (req, res) =>{
//     res.send('Successfully Uploaded');
// });

// Multiple files - extended
app.post('/', upload.fields([
    {name: "avatar", maxCount: 1},
    {name: "doc", maxCount: 1}
]), (req, res) =>{
    console.log(req.files);
    res.send('Successfully Uploaded');
});


// Error handling
app.use((err, req, res, next)=> {
    if(err){
        if( err instanceof multer.MulterError) {
            res.status(500).send("There was an error in upload file!");
        } else {
            res.status(500).send(err.message);
        } 
    } else {
        res.send("Success!");
    }
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});



