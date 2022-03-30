const express= require("express");
const user = require("./src/user");
const shop = require("./src/shop");
const cors = require("cors");
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
    let ans= await shop.getShops(req.query.id);
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