const mongoose = require('mongoose');

const englishModel = new mongoose.Schema
(
    {
        EnglishWord:
        {
            type: String,
            required: true
        },
        OtherLanguageWord:
        {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('EnglishModel', englishModel);