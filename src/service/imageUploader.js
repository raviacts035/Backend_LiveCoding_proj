// import s3 from "../config/s3Config.js";


// Uploading Object(media file) to AWS s3 bucket
export const s3FIleUpload = async ({bucketName, key, body, contentType})=>{
    return await s3.upload({
        Bucket: bucketName,
        Key:key,
        Body:body,
        ContentType:contentType
    })
    .promise()
}

// Deleting Object from AWS s3 bucket
export const s3DeleteFile = async ({bucketName, key})=>{
    return await s3.deleteObject({
        Bucket: bucketName,
        Key:key
    })
    .promise()
}