//course_index, course_math, course_english

const course_index = (req, res) => {
    res.render('course/courses')
};

const course_math = (req, res) => {
    res.render('course/mathematics')
};

const course_english = (req, res) => {
    res.render('course/english')
};

module.exports = {
    course_index,
    course_math,
    course_english
};