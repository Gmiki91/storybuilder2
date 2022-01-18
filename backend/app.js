const express = require('express');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('Uncaught exception. Shutting down...')
    console.log(err.name, err.message);
    process.exit(1);
})

const cors = require('cors');
const app = express();

const port = process.env.PORT || 3030;
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const storyRoute = require('./routes/storyRoute');
const userRoute = require('./routes/userRoute');
const pageRoute = require('./routes/pageRoute');

app.use(cors());
app.use(express.json());

app.use('/api/stories', storyRoute);
app.use('/api/users', userRoute);
app.use('/api/pages', pageRoute);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)

const server = app.listen(port, () => console.log(`Express server listening on port ${port}`))
mongoose.connect(
    "mongodb+srv://miki:ym44lbXwDms6T62K@cluster0.hakyf.mongodb.net/storybuilder?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to database!");
    });

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection. Shutting down...')
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});


