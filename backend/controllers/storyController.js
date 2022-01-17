const Story = require('../models/story');

exports.createStory = async (req, res) => {
    const story = await Story.create({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        level: req.body.level,
        authorId: req.body.authorId,
        rating: 0,
        updatedAt: new Date(),
        openEnded: false,
        pageIds: [],
        pendingPageIds: []
    });
    res.status(200).json(story._id);
}

exports.getStory=async (req, res) => {
    const story = await Story.findById(req.params.id);
    res.status(200).json(story);

}

exports.getStories =  async (req, res) => {
    const query ={};
    if(req.body.from==='own'){
        //query['authorId'] = userId
    }else if(req.body.from==='favorites'){
        //query['authorId'] = favorites
    }
    if(req.body.languages.length>0) query['language']=req.body.languages;
    if(req.body.levels.length>0)query['level']= req.body.levels;
    if(req.body.openEnded!=='both')query['openEnded']=req.body.openEnded;
    
    const {sortBy, sortDirection} = req.body;
    const sortObject = {};
    sortObject[sortBy] = sortDirection;
    const result = await Story
        .find(query)
        .sort(sortObject)
        .limit(50);
    res.send(result);
}

exports.deleteStory = (req, res) => {
    Story.findByIdAndDelete(req.params.id).then(() => res.send('deleted'));
}

exports.rateStory = async (req, res) => {
    const story = await Story.findById(req.body.storyId);
    story.rating += req.body.rate;
    await story.save();
    res.status(200).send('ok');
}

exports.addPage = async (req, res) => {
    const story = await Story.findById(req.body.storyId);
    story.pageIds.push(req.body.pageId);
    await story.save();
    res.status(200).send('saved');
}

exports.addPendingPage = async (req, res) => {
    const story = await Story.findById(req.body.storyId);
    story.pendingPageIds.push(req.body.pageId);
    await story.save();
    res.status(200).send('saved');
}