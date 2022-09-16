const salesOrderServices = require('../services/salesOrder.service')
const express = require('express');
const router = express.Router();
const Multer = require('multer');
var fs = require('fs');

// const { Storage } = require('@google-cloud/storage');

// const GCLOUD_STORAGE_BUCKET = "smart-services-test"
// const creds = {
//     "type" : "service_account",
//     "keyFilename" : process.env.GOOGLE_APPLICATION_CREDENTIALS
// }
// const storage = new Storage(
//     {
//         credentials: creds,
//     }
// );
// const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
//     },
// });

// const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if(file.fieldname === 'aso_file'){
//             cb(null, './public/files/')
//         }
//         else if(file.fieldname === 'wso_file'){
//             cb(null, './public/files/')
//         }
//     },
//     filename: function (req, file, cb) {
//         // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage: storage })
// const upload = multer({ dest: './public/files/' })
router.get("/get", async function (req, res, next) {
    try {
        if (req.query.status) { //* get by order_status (gate_keeper , order_lists ,complete , ....)
            res.json(await salesOrderServices.findByStatus(req.query.status))
        }
        else { //* if status is NULL get all orders
            res.json(await salesOrderServices.find())
        }
    }
    catch (err) {
        res.json(err)
    }
});

router.get("/get/is_confirm/:value", async function (req, res, next) {
    try {
        let value = req.params.value;
        res.json(await salesOrderServices.findByConfirmed(value));
    }
    catch (err) {
        res.json(err)
    }
})

// var uploadFnct = function (dir_name, type) {
//     var storage = multer.diskStorage({ //multers disk storage settings
//         destination: async function (req, file, cb) {
//             console.log(req.body)
//             var result = await salesOrderServices.create_by_form(req.body)

//             var dest = './public/files/' + result.dataValues.oid.toString() + '/' + type;
//             var stat = null;
//             try {
//                 stat = fs.statSync(dest);
//             } catch (err) {
//                 fs.mkdirSync(dest);
//             }
//             if (stat && !stat.isDirectory()) {
//                 throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
//             }
//             cb(null, dest)
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.originalname);
//         }
//     });

//     var upload = multer({ //multer settings
//         storage: storage
//     }).fields([{ name: type }, { name: 'form' }]);

//     return upload;
// };

router.post("/create/order-form", async function (req, res, next) {
    console.log(req.files)
    try {
        res.json(await salesOrderServices.create_by_form(req.body,req.files))
        // console.log(bucket)
        // // Create a new blob in the bucket and upload the file data.
        // const blob = bucket.file(req.files['aso_file'][0]);
        // const blobStream = blob.createWriteStream();

        // blobStream.on('error', err => {
        //     next(err);
        // });

        // blobStream.on('finish', () => {
        //     // The public URL can be used to directly access the file via HTTP.
        //     const publicUrl = format(
        //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        //     );
        //     res.status(200).send(publicUrl);
        // });

        // blobStream.end(req.files['aso_file'][0].buffer);
        // console.log(result.dataValues.oid.toString());
        // console.log(req.files)

        // var currUpload = uploadFnct(1, 'aso_file');
        // currUpload(req, res, function (err) {
        //     if (err) { 
        //         res.json({ error_code: 1, err_desc: err });
        //         return;
        //     }
        //     res.json({ error_code: 0, err_desc: null, filename: req.file.filename });
        // });


        // res.json(true)
    }
    catch (err) {
        res.json(err)
    }
})

router.post("/create/order-set", async function (req, res, next) {
    try {

        let aso_file = req.files.aso_file;
        let wso_file = req.files.wso_file;
        let body = JSON.parse(req.body.data)


        res.json(await salesOrderServices.create_by_files(body, aso_file, wso_file))
    }
    catch (err) {
        res.json(err)
    }
})

router.post("/create/readFile", async function (req, res, next) {

    try {
        let file = req.files.file;

        // let body = JSON.parse(req.body.data)

        res.json(await salesOrderServices.testReadFile(file))
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/update/order/truck-order-id" , async function (req, res, next) {
    try {
        res.json(await salesOrderServices.addOrderToTruckOrder(req.body))
    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
})

router.patch("/update/order-form", async function (req, res, next) {
    try {

        // let aso_file = req.files.aso_file;
        // let wso_file = req.files.wso_file;
        // let body = JSON.parse(req.body.data)

        // console.log(req.files);

        res.json(await salesOrderServices.updateOneOrder(req.body,req.files))
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/update/order/status", async function (req, res, next) {
    try {

        res.json(await salesOrderServices.updateStatus(req.body.status_target, req.body.oid))
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/delete/file/other",async function (req, res, next) {
    try{
        res.json(await salesOrderServices.deleteOneOtherFile(req.body.oid,req.body.file_name))
    }
    catch (err) {
        res.json(err)
    }
})


router.get("/get/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        res.json(await salesOrderServices.findById(id));
    }
    catch (err) {
        res.json(err)
    }
})

module.exports = {
    router,
};