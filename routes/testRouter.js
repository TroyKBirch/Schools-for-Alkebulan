const express = require('express');
const router = express.Router();
const questionModel = require('../models/questionModel');
const testModel = require('../models/testModel');
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
        const tests = await testModel.find()
        res.render('../views/course/TestSelect.ejs', 
        {
            tests: tests
        })
    }
    catch (error) 
    {
        res.status(500).json({message: error.message});
    }
});

// check Question
router.post('/:id/checkTest', getQuestion, urlEncodedParser, (req, res) => {
    var userAnswer = req.body.userAnswer;
    var answer = res.questionModel.answer;

    var msg;
    if (userAnswer == answer) 
    {
        msg = "That is correct! 😎😎😎";
    }
    else
    {
        msg = "That is incorrect! 😞😞😞"; 
    }

    res.render('../views/test/answer', {question: res.questionModel.question, answer: answer, userInput: userAnswer, AnswerStatus: msg, questionID: res.questionModel.id})
});

//get one test
router.get('/:id', getTest, (req, res) => 
{
    res.json(res.testModel)
});

//get testPage
router.get('/:id/test', getTest, async (req, res) => { 
    
    const questions = await questionModel.find();

    var question1;
    var question2;
    var question3;
    var question4;
    var question5;

    for (let i = 0; i < questions.length; i++) 
    {
        if (questions[i].id == res.testModel.q1) 
        {
            question1 = questions[i];
        }
        else if (questions[i].id == res.testModel.q2) 
        {
            question2 = questions[i];
        }
        else if (questions[i].id == res.testModel.q3) 
        {
            question3 = questions[i];
        }
        else if (questions[i].id == res.testModel.q4) 
        {
            question4 = questions[i];
        }
        else if (questions[i].id == res.testModel.q5) 
        {
            question5 = questions[i];
        }
    }

    res.render('../views/test/test', 
    {   
        q1: question1.question,
        q1ID: res.testModel.q1,

        q2: question2.question,
        q2ID: res.testModel.q2,

        q3: question3.question,
        q3ID: res.testModel.q3,

        q4: question4.question,
        q4ID: res.testModel.q4,
        
        q5: question5.question,
        q5ID: res.testModel.q5,

        testID: res.testModel.id
    })
});

//! check test
router.post('/:id/:id/checkTest', getTest, urlEncodedParser, async (req, res) => {
    var q1Answer = req.body.txtq1Answer;
    var q2Answer = req.body.txtq2Answer;
    var q3Answer = req.body.txtq3Answer;
    var q4Answer = req.body.txtq4Answer;
    var q5Answer = req.body.txtq5Answer;

    const questions = await questionModel.find();

    for (let i = 0; i < questions.length; i++) 
    {
        if (questions[i].id == res.testModel.q1) 
        {
            question1 = questions[i];
        }
        else if (questions[i].id == res.testModel.q2) 
        {
            question2 = questions[i];
        }
        else if (questions[i].id == res.testModel.q3) 
        {
            question3 = questions[i];
        }
        else if (questions[i].id == res.testModel.q4) 
        {
            question4 = questions[i];
        }
        else if (questions[i].id == res.testModel.q5) 
        {
            question5 = questions[i];
        }
    }

    //checking question
    var questionArray = [question1, question2, question3, question4, question5];
    var q1status = false;
    var q2status = false;
    var q3status = false;
    var q4status = false;
    var q5status = false;

    //! long if statement
    if (question1.answer == q1Answer) 
    {
        q1status = true;
    } 
    else 
    {
        q1status = false;
    }

    if (question2.answer == q2Answer) 
    {
        q2status = true;
    } 
    else 
    {
        q2status = false;
    }

    if (question3.answer == q3Answer) 
    {
        q3status = true;
    } 
    else 
    {
        q3status = false;
    }

    if (question4.answer == q4Answer) 
    {
        q4status = true;
    } 
    else 
    {
        q4status = false;
    }

    if (question5.answer == q5Answer) 
    {
        q5status = true;
    } 
    else 
    {
        q5status = false;
    }
    
    q1Icon = getMarkIcon(q1status);
    q2Icon = getMarkIcon(q2status);
    q3Icon = getMarkIcon(q3status);
    q4Icon = getMarkIcon(q4status);
    q5Icon = getMarkIcon(q5status);

    res.render('../views/test/testAnswer', 
    {
        //answers
        q1Answer: q1Answer,
        q2Answer: q2Answer,
        q3Answer: q3Answer,
        q4Answer: q4Answer,
        q5Answer: q5Answer,

        //icons
        q1Icon: q1Icon,
        q2Icon: q2Icon,
        q3Icon: q3Icon,
        q4Icon: q4Icon,
        q5Icon: q5Icon
    })
})
//#endregion

//#region CRUD
// create one
router.post('/', async (req, res) => {
    const testObj = new testModel({
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5
    })

    try 
    {
        const newTest = await testObj.save();
        res.status(201).json(newTest)
    } 
    catch (error) 
    {
        res.status(400).json({message: error.message})
    }
});

// update one
router.patch('/:id', getTest, async (req, res) => {
    if (req.body.q1 != null) {
        res.testModel.q1 = req.body.q1;
    }
    if (req.body.q2 != null) {
        res.testModel.q2 = req.body.q2;
    }
    if (req.body.q3 != null) {
        res.testModel.q3 = req.body.q3;
    }
    if (req.body.q4 != null) {
        res.testModel.q4 = req.body.q4;
    }
    if (req.body.q5 != null) {
        res.testModel.q5 = req.body.q5;
    }

    try {
        const updatedTest = await res.testModel.save();
        res.json(updatedTest)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

// delete one
router.delete('/:id', getTest, async (req, res) => {
    try {
        await res.testModel.remove()
        res.json({ message: 'Deleted Test'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});
//#endregion

//#endregion

//#region middleware functions
async function getQuestion(id) 
{
    let question;
    try 
    {
        question = await questionModel.findById(id)
        
        if (questionModel == null) 
        {
            return res.status(404).json({message: 'Cannot find Question'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    return question;
}

async function getTest(req, res, next) 
{
    let test;
    try 
    {
        test = await testModel.findById(req.params.id)
        
        if (testModel == null) 
        {
            return res.status(404).json({message: 'Cannot find Question'});
        }
    } 
    catch (error) 
    {
        return res.status(500).json({message: error.message})
    }

    res.testModel = test;
    next();
}
//#endregion

//#region functions
function getMarkIcon(QuestionStatus) 
{
    if (QuestionStatus == true) 
    {
        return "✔";
    }
    else
    {
        return "❌";
    }
}
//#endregion
module.exports = router;