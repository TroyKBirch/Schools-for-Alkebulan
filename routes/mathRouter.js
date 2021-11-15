const express = require('express');
const router = express.Router();
const mathModel = require('../models/mathModel');
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
        const mathModels = await mathModel.find()

        res.render('../views/counting/countAll.ejs', 
        {
            MathModels: mathModels
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
    const math = new mathModel
    (
        {
            EnglishNumber: req.body.EnglishNumber,
            OtherLanguageNumber: req.body.OtherLanguageNumber,
            number: req.body.number
        }
    )

    try 
    {
        const newMath = await math.save();
        res.status(201).json(newMath)
    } 
    catch (error) 
    {
        res.status(400).json({message: error.message})
    }
});

// update one
router.patch('/:id', getMath, async (req, res) => 
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
        const updatedMath = await res.mathModel.save();
        res.json(updatedMath)
    }
    catch (error)
    {
        res.status(400).json({message: error.message})
    }
});

// delete one
router.delete('/:id', getMath, async (req, res) => {
    try 
    {
        await res.mathModel.remove()
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
async function getMath(req, res, next) 
{
    let math;
    try 
    {
        math = await mathModel.findById(req.params.id)
        
        if (mathModel == null) 
        {
            return res.status(404).json({message: 'Cannot find Math entry'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    res.mathModel = math;
    next();
}
//#endregion

module.exports = router;