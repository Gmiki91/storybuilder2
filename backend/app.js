const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app  = express();
const port = 3030;
const storyRoute = require('./routes/storyRoute');
const userRoute = require('./routes/userRoute');
const pageRoute = require('./routes/pageRoute');

app.use(cors());
app.use(express.json());
app.use('/api/stories', storyRoute);
app.use('/api/users', userRoute);
app.use('/api/pages', pageRoute);

app.listen(port,()=>console.log(`Express server listening on port ${port}`))
mongoose.connect(
    "mongodb+srv://miki:ym44lbXwDms6T62K@cluster0.hakyf.mongodb.net/storybuilder?retryWrites=true&w=majority",
    {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to database!");
}).catch((err)=>{
    console.log("Connection to database failed" + err); 
});
