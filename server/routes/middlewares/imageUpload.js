const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log('Original Filename:', file.originalname);
        const uniqueSuffix = Date.now();
        const fileName = `${uniqueSuffix}-${file.originalname}`;
        console.log('Generated Filename:', fileName);
        cb(null, fileName);
    }
})
console.log("this is image route here is coming")

const upload = multer({ storage: storage }).array("image", 12);

module.exports=upload