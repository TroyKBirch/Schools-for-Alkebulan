const mongoose = require('mongoose');

const mathModel = new mongoose.Schema
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

module.exports = mongoose.model('MathModel', mathModel);