const express = require("express")
const app = express()
const cors = require("cors")
require("./Db/db")
require("dotenv").config()
const PORT =process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use("/post",require("./routes/post"))
app.use("/auth",require("./routes/auth"))
app.use("/follow",require("./routes/follow"))
app.use("/notification",require("./routes/notification"))
app.use("/chat",require("./routes/chat"))

app.listen(PORT,()=>{
  console.log("app is running")
})