const express = require("express")
const multer = require("multer")
const bcrypt = require("bcrypt")
const connectDB = require("./database/database")
const File = require("./database/models/file");
const { urlencoded } = require("express");

connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }))
const PORT = 3000;
const upload = multer({ dest: "uploads" })

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if (req.body.password != null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }

    const file = await File.create(fileData)
    res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
})

app.route("/file/:id").get(handelDownload).post(handelDownload)

async function handelDownload(req, res) {
    const file = await File.findById(req.params.id)
    if (file.password != null) {
        if (req.body.password == null) {
            res.render("password")
            return
        }
        if (!(await bcrypt.compare(req.body.password, file.password))) {
            res.render("password", { error: true })
        }
    }

    file.downloadCount++;
    await file.save();
    res.download(file.path, file.originalName)
}

app.listen(PORT, () => {
    console.log("started on port: http://localhost:" + PORT);
})