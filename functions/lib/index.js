"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
var cors = require('cors')({ origin: true });
const Busboy = require("busboy");
var path = require("path");
var os = require("os");
const fs = require("fs");
const gcconfig = {
    projectID: "react-base-6ef41",
    keyFilename: "react-base-6ef41-firebase-adminsdk-67yw4-ac820c8a60"
};
const gcs = require("@google-cloud/storage")(gcconfig);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// const option:cors.CorsOptions = {
//     origin: true
// }
exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            res.status(500).json({
                message: 'Not allowed'
            });
        }
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;
        busboy.on("file", (fieldname, file, filename, endcoding, mimetype) => {
            const filePath = path.join(os.tmpdir(), filename);
            uploadData = { file: filePath, type: mimetype };
            file.pipe(fs.createWriteStream(filePath));
        });
        busboy.on("finish", () => {
            const buckets = gcs.bucket("react-base-6ef41.appspot.com");
            buckets.upload(uploadData.file, {
                uploadType: "media",
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            })
                .then((err, uploadedFile) => {
                res.status(200).json({
                    message: "It workedd"
                });
            })
                .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        });
        busboy.end(req.body);
    });
});
//# sourceMappingURL=index.js.map