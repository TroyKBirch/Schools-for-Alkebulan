const mongoose = require('mongoose');

const countingModel = new mongoose.Schema
(
    {
        EnglishNumber:
        {
            type: String,
            required: true
        },
        OtherLanguageNumber:
        {
            type: String,
            required: true
        },
        number:
        {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('CountingModel', countingModel);