const express = require("express")
const mongoose = require ("mongoose")
require("dotenv").config();
const cors = require("cors"); //backend connection
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

app.get("/", (req , resp)=>{
    resp.send("Hello ji kaise ho aap sab ");
})

app.use("/api/auth", authRoutes);

// MongoDB se connect karo
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.listen(PORT ,()=>{
    console.log(`server is listening on port ${PORT}`);
});