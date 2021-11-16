const express = require('express');
const router = express.Router();
const questionModel = require('../models/questionModel');
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({extended: false})

//#region router functions

//#region get requests
//get all
router.get('/', async (req, res) => 
{
    try
    {
        const questions = await questionModel.find()
        res.json(questions)
    }
    catch (error) 
    {
        res.status(500).json({message: error.message});
    }
});

//get random
router.get("/randomQuestion", async (req, res) => {
    try 
    {
        const getArray = await questionModel.find();
        var randomQuestion = Math.floor(Math.random() * getArray.length);
        res.render('index', {question: getArray[randomQuestion].question, questionID: getArray[randomQuestion].id}) 

    } 
    catch (error) 
    {
        res.status(500).json({message: error.message});
    }
});

//check Question
router.post('/:id/checkAnswer', getQuestion, urlEncodedParser, (req, res) => {
    var userAnswer = req.body.userAnswer;
    var answer = res.questionModel.answer;

    var msg;
    if (userAnswer == answer) 
    {
        msg = "That is correct! 😎😎😎";
    }
    else
    {
        msg = "Get Fucked! 🥵🥵🥵"; 
    }

    res.render('answer', {question: res.questionModel.question, answer: answer, userInput: userAnswer, AnswerStatus: msg, questionID: res.questionModel.id})
});

//get one
router.get('/:id', getQuestion, (req, res) => {
    // res.send(res.questionModel.question)
    res.render('index', {question: res.questionModel.question, questionID: res.questionModel.id})
});
//#endregion

//#region CRUD
//create one
router.post('/', async (req, res) => {
    const questionObj = new questionModel({
        question: req.body.question,
        answer: req.body.answer
    })

    try {
        const newQuestion = await questionObj.save();
        res.status(201).json(newQuestion)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

//update one
router.patch('/:id', getQuestion, async (req, res) => {
    if (req.body.question != null) {
        res.questionModel.question = req.body.question;
    }
    if (req.body.answer != null) {
        res.questionModel.answer = req.body.answer;
    }

    try {
        const updatedQuestion = await res.questionModel.save();
        res.json(updatedQuestion)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

//delete one
router.delete('/:id', getQuestion, async (req, res) => {
    try {
        await res.questionModel.remove()
        res.json({ message: 'Deleted Question'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});
//#endregion

//#endregion

//#region middleware functions
async function getQuestion(req, res, next) {
    let question;
    try 
    {
        question = await questionModel.findById(req.params.id)
        
        if (questionModel == null) 
        {
            return res.status(404).json({message: 'Cannot find Question'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    res.questionModel = question;
    next();
}
//#endregion

module.exports = router;