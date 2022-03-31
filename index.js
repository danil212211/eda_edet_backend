const express= require("express");
const user = require("./src/user");
const shop = require("./src/shop");
const cors = require("cors");
const multer= require("multer");
const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Projects_Hackaton/eda_frontend/src/assets/products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)+".png") //Appending extension
    }
})

const uploadProduct=multer({ storage : storage});
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.post("/register",async (req,res) => {
    let ans = await user.register(req);
    res.status(200).json(ans);
});
app.get("/verification",async (req,res) => {
    let ans = await user.verify(req);
    res.status(200).json(ans);

});
app.get("/shops",async (req,res) => {

    let ans= await shop.getShops(req.query);
    res.status(200).json(ans);
});
app.get("/tags",async (req,res) => {
    let ans = await shop.getTags(req);
    res.status(200).json(ans);
});
app.get("/shops/:id/products",async (req,res) => {
    console.log("ksdfj");
    let ans =await shop.getProductsByShop(req.params.id);
    res.status(200).json(ans);
});
app.get("/shops/:id",async (req,res) => {
    let ans= await shop.getShopById(req.params.id);
    res.status(200).json(ans);
});
app.post("/shops/:id/add_product", uploadProduct.single('image'),async (req,res)=> {
    let ans = await shop.addProduct(req);
    res.status(200).json(ans);
});
app.get("/discounts",async (req,res) => {
    let ans= await shop.getDiscounts(req.query.id);
    res.status(200).json(ans);
});

app.get("/login", async (req,res) => {
    let ans = await user.login(req);
    res.status(200).json(ans);

});

app.listen(port);