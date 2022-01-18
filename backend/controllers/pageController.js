const Page = require('../models/page');

exports.getPage = async (req, res) => {
    const page = await Page.findById(req.params.id)
    const mappedPage = {
        ...page.toObject(),
        level: mapRateNumToString(page.levels.reduce((sum, level) => sum + level.rate, 0) / page.levels.length)
    }
    res.status(200).json(mappedPage);
}

exports.deletePendingPages = async (req, res) => {
    const ids = req.params.ids.split(',');
    await Page.deleteMany({_id:{$in:ids}});
    res.status(200).json({message:'deleted'});
}

/*exports.getPendingPages = async (req, res) => {
    const ids = req.params.ids.split(',');
    const pages = await Page.find({ _id: { $in: ids } });
    const mappedPages = pages.map(page => (
        {
            ...page.toObject(),
            level: mapRateNumToString(page.levels.reduce((sum, level) => sum + level.rate, 0) / page.levels.length)
        }
    ));
    res.status(200).json(mappedPages);
}*/


exports.createPage = async (req, res) => {
    const page = await Page.create({
        text: req.body.text,
        levels: [{ userId: '', rate: mapRateStringToNum(req.body.level) }],
        language: req.body.language,
        authorId: req.body.authorId,
        ratings: req.body.rating,
        status: req.body.status,
    });
    res.send(page._id)
}

exports.deletePage = async (req, res) => {
    await Page.findByIdAndDelete(req.params.id);
    res.send('deleted');
}

exports.rateText = async (req, res) => {
    const page = await Page.findById(req.body.pageId);
    const { rate } = req.body;
    const vote = page.ratings.find(rate => rate.userId === req.body.authorId)
    vote ?
        vote.rate = rate :
        page.ratings.push({ userId: req.body.authorId, rate: rate })
    await page.save();
    res.status(200).json('rated');
}

exports.rateLevel = async (req, res) => {
    const page = await Page.findById(req.body.pageId);
    const rate = mapRateStringToNum(req.body.rate);
    const vote = page.levels.find(level => level.userId === req.body.authorId)
    if (vote) {
        vote.rate = rate
    } else {
        page.levels.push({ userId: req.body.authorId, rate: rate });
    }
    await page.save();
    res.status(200).json('ok');
}

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