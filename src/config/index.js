import dotenv from "dotenv"

dotenv.config()

const config ={
    PORT:process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm",
    JWT_SECRET:process.env.JWT_SECRET || "Raveendra",
    JWT_EXPIRY:process.env.JWT_EXPIRY || '1d',

    s3_ACCESS_KEY: process.env.youracesskey,
    s3_SECRET_ACCESS_KEY: process.env.secret_access_key,
    s3_REGION_NAME: process.env.you_AWS_Region,
    s3_BUCKET_NAME: process.env.Your_Bucket_Name,
}

export default config