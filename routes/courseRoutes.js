const express = require('express');
const courseRouter = express.Router();
const courseController = require('../controllers/courseController');

courseRouter.get('/', courseController.course_index);
courseRouter.get('/mathematics', courseController.course_math);
courseRouter.get('/english', courseController.course_english);
courseRouter.get('/:id', (req, res) => {
    //Something
});

module.exports = courseRouter;
