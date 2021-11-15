const express = require('express');
const router = express.Router();
const englishModel = require('../models/englishModel');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { model } = require('mongoose');

const urlEncodedParser = bodyParser.urlencoded({extended: false})

//#region router functions

//#region get requests
// get all
router.get('/', async (req, res) => 
{
    try
    {
        const englishModels = await englishModel.find()

        res.render('../views/english/englishAll.ejs', 
        {
            EnglishModels: englishModels
        })
    }
    catch (error)
    {
        res.status(500).json({message: error.message});
    }
});
//#endregion

//#region CRUD
// create one
router.post('/', async (req, res) => 
{
    const english = new englishModel
    (
        {
            EnglishWord: req.body.EnglishWord,
            OtherLanguageWord: req.body.OtherLanguageWord
        }
    )

    try 
    {
        const newEnglish = await english.save();
        res.status(201).json(newEnglish)
    } 
    catch (error) 
    {
        res.status(400).json({message: error.message})
    }
});

// update one
router.patch('/:id', getEnglish, async (req, res) => 
{
    if (req.body.EnglishWord != null)
    {
        res.testModel.EnglishWord = req.body.EnglishWord;
    }
    if (req.body.OtherLanguageWord != null) 
    {
        res.testModel.OtherLanguageWord = req.body.OtherLanguageWord;
    }

    try
    {
        const updatedenglish = await res.englishModel.save();
        res.json(updatedenglish)
    }
    catch (error)
    {
        res.status(400).json({message: error.message})
    }
});

// delete one
router.delete('/:id', getEnglish, async (req, res) => {
    try 
    {
        await res.englishModel.remove()
        res.json({ message: 'Deleted english entry'})
    } 
    catch (error) 
    {
        res.status(500).json({message: error.message})
    }
});
//#endregion

//#endregion

//#region middleware functions
async function getEnglish(req, res, next) 
{
    let english;
    try 
    {
        english = await englishModel.findById(req.params.id)
        
        if (englishModel == null) 
        {
            return res.status(404).json({message: 'Cannot find English entry'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    res.englishModel = english;
    next();
}
//#endregion

module.exports = router;