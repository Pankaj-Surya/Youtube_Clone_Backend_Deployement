import dotenv from "dotenv";
dotenv.config()

module.exports={
    PORT : process.env.PORT,
    MONGO : process.env.MONGO
}
