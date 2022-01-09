const express = require('express');
const router = express.Router();

const Page = require('../models/page');

router.get('/:ids',async(req,res)=>{
    const pages = await Page.find({id:{$in:req.params.ids}});
    res.status(200).json(pages);
});

router.post('/', async(req, res)=>{
    const page = Page({
        text: req.body.text,
        level: req.body.value,
        language:req.body.language,
        authorId:req.body.authorId,
        rating:req.body.rating,
        status:req.body.status,
        translations:req.body.translations
    });
    const obj = await page.save();
    res.send(obj._id)
})
module.exports=router;