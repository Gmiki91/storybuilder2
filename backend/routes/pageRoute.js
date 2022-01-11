const express = require('express');
const router = express.Router();

const Page = require('../models/page');

router.get('/:ids', async (req, res) => {
    const ids = req.params.ids.split(',');
    const pages = await Page.find({ _id: { $in: ids } });
    const mappedPages = pages.map(page => (
        {...page.toObject(),
            level: mapRateNumToString(page.levels.reduce((sum, level) => sum + level.rate, 0) / page.levels.length)
        }
    ));
    res.status(200).json(mappedPages);
});

router.post('/', async (req, res) => {
    const page = Page({
        text: req.body.text,
        levels: [{ userId: '', rate: mapRateStringToNum(req.body.level) }],
        language: req.body.language,
        authorId: req.body.authorId,
        ratings: req.body.rating,
        status: req.body.status,
    });
    const obj = await page.save();
    res.send(obj._id)
});

router.put('/rate', async (req, res) => {
    const page = await Page.findById(req.body.pageId);
    const vote  = mapRateStringToNum(req.body.vote);
    page.levels.push({userId:'',rate:vote});
    await page.save();
    res.send('ok');
})

const mapRateNumToString = (rate) => {
    if (rate < 1.5) return 'A';
    if (rate >= 1.5 && rate < 2.5) return 'A+';
    if (rate >= 2.5 && rate < 3.5) return 'B';
    if (rate >= 3.5 && rate < 4.5) return 'B+';
    if (rate >= 4.5 && rate < 5.5) return 'C';
    if (rate >= 5.5) return 'N';
}

const mapRateStringToNum = (rate) => {
    switch (rate) {
        case 'A': return 1;
        case 'A+': return 2;
        case 'B': return 3;
        case 'B+': return 4;
        case 'C': return 5;
        case 'N': return 6;
    }
}

module.exports = router;