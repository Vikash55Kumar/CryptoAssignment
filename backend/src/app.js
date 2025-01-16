import express from "express";
import cors from "cors"

const app = express()

app.use(cors({
    origin:["http://localhost:5173"],
    methods: "DELETE, POST, GET, PUT",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials:true
}))

app.use(express.json({limit:"15kb"}))
app.use(express.urlencoded({extended:true, limit:'15kb'}))
app.use(express.static("public"))
app.use(cookieParser())

// routes imported
import cryproRouter from "./routers/crypto.router.js"
import cookieParser from "cookie-parser";


//route decleration
app.use("/api/v1/cryptos", cryproRouter)


export {app}