import aws from "aws-sdk";
import config from './index.js';


const s3=aws.S3({
    accessKeyID:config.s3_ACCESS_KEY,
    secretAccessKey: config.s3_SECRET_ACCESS_KEY,
    region: config.s3_REGION_NAME
})

export default s3