const express = require('express');
const router = express.Router();
const countingModel = require('../models/countingModel');
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
        const countingModels = await countingModel.find()

        res.render('../views/counting/countAll.ejs', 
        {
            CountingModels: countingModels
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
    const counting = new countingModel
    (
        {
            EnglishNumber: req.body.EnglishNumber,
            OtherLanguageNumber: req.body.OtherLanguageNumber,
            number: req.body.number
        }
    )

    try 
    {
        const newCounting = await counting.save();
        res.status(201).json(newCounting)
    } 
    catch (error) 
    {
        res.status(400).json({message: error.message})
    }
});

// update one
router.patch('/:id', getCounting, async (req, res) => 
{
    if (req.body.EnglishNumber != null)
    {
        res.testModel.EnglishNumber = req.body.EnglishNumber;
    }
    if (req.body.OtherLanguageNumber != null) 
    {
        res.testModel.OtherLanguageNumber = req.body.OtherLanguageNumber;
    }
    if (req.body.number != null) 
    {
        res.testModel.number = req.body.number;
    }

    try
    {
        const updatedCounting = await res.countingModel.save();
        res.json(updatedCounting)
    }
    catch (error)
    {
        res.status(400).json({message: error.message})
    }
});

// delete one
router.delete('/:id', getCounting, async (req, res) => {
    try 
    {
        await res.countingModel.remove()
        res.json({ message: 'Deleted counting entry'})
    } 
    catch (error) 
    {
        res.status(500).json({message: error.message})
    }
});
//#endregion

//#endregion

//#region middleware functions
async function getCounting(req, res, next) 
{
    let counting;
    try 
    {
        counting = await countingModel.findById(req.params.id)
        
        if (countingModel == null) 
        {
            return res.status(404).json({message: 'Cannot find Counting entry'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    res.countingModel = counting;
    next();
}
//#endregion

module.exports = router;