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

    SMTP_MAIL_HOST:process.env.SMTP_MAIL_HOST,
    SMTP_Mail_PORT:12345 || process.env.SMTP_Mail_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD:process.env.SMTP_MAIL_PASSWORD,
    SMTP_SENDER_EMAIL:process.env.SMTP_SENDER_EMAIL,

}

export default config