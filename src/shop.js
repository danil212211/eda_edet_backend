const database = require("./db.js");
const path = require('path');
let db= database.db;
let codes=database.codes;
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
function checkExist(a) {
    return typeof  a !== "undefined" && a != null;
}
async function getTags(req) {
    let data=req.query;
    return await db.query("SELECT * FROM tags");
}
async function addProduct(req) {
    let data=req.body;
    let fileName=path.parse(req.file.path).name;
    let prName=data.name;
    let prAmount=data.amount;
    let prDesc=data.description;
    let prPrice=data.price;
    let tags=data.tags;
    console.log("123");
    console.log(tags);
    let shopId=req.params.id;
    let insertTags=`INSERT INTO product_tags (tag_id,product_id) VALUES `;


    let product=await db.query(`INSERT INTO products (shop_id , name , amount , description , cost , image_src) VALUES (${shopId} , '${prName}', '${prAmount}', '${prDesc}' , '${prPrice}' , '${fileName}')`);
    for (let i =0;i<tags.length;++i) {
        let element=JSON.parse(tags[i]);
        insertTags+= (`( ${element.value}, ${product.insertId})`);
        if (i<tags.length-1) insertTags+=",";
    }
    await db.query(insertTags);
}
async function getProductsByShop (shopId) {
    console.log(shopId);
    return await db.query(`SELECT * FROM products WHERE shop_id=${shopId}`);
}
async function getShops(query) {
    let toId=query.toId;
    if (checkExist(toId)) {

        console.log("check");
        let data=await db.query(`SELECT * FROM shops WHERE id<${toId}`).catch( err=> {console.log("oof")});
        console.log(data);
        return data;

    }
    return {
        code : codes.badCode
    }
}
async function getShopById(id) {
    if (checkExist(id)) {
        return await db.query(`SELECT * FROM shops WHERE id=${id}`);
    }
    return {
        code : codes.badCode
    };
}
async function getDiscounts(toId) {
    return await db.query(`SELECT * FROM discounts WHERE id<${toId}`);
}
module.exports= {
    getShops : getShops,
    getShopById :getShopById,
    getDiscounts : getDiscounts,
    addProduct :addProduct,
    getTags : getTags,
    getProductsByShop : getProductsByShop
};