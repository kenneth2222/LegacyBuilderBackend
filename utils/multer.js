const multer = require('multer');
//Configure the storage
const storage = multer.diskStorage({
    // The destination where the file will be store
    destination: (req, file, cb) => {
        // Pass the original name to the file
        cb(null, './uploads')
    },
    //The name to store the file with (which is the original file name)
    filename: (req, file, cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.mimetype.split('/')[1]
        cb(null, `IMG_${uniqueSuffix}.${ext}`)
    }
});

const fileFilter = (req, file, cb) => {
    //Check the mimetype of the file(For this instance it must be an image)
    if (file.mimetype.startsWith('image/')){
        //Return True if it mets the condition
        cb(null, true)
    } else {
        //Throw sn Error if the wrong file tpye is passed
        cb(new Error('Invalid file type'))
    }
};
//Define a limit to the file size
const fileSize = {
    limits: 1024 * 1024 * 10
};
//Pass all the configuration of multer to the variable upload
const upload = multer ({
    storage,
    fileFilter,
    limits:fileSize

})
//Export the upload variable which holds the multer configuration
module.exports = upload