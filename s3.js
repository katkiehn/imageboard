const aws = require("aws-sdk");
const fs = require("fs");
const secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
// , since we use this in multiple places, I only need to change this variable if I change the bucket value

exports.S3_BUCKET = secrets.S3_BUCKET;

// aws expects these key names
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    // 's3 represents our user'
    s3.putObject({
        // bucket name needs to be changed in case I open my own aws account- own bucket
        Bucket: S3_BUCKET,
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then((data) => {
            // it worked!!!
            console.log("amazon upload successful", data);
            next();
            // will delete the image we just uploaded from the uploads folder
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("err in upload put object in S3.js", err);
            res.sendStatus(404);
        });
};
