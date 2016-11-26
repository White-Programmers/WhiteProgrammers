const School = require('mongoose').model('School');

module.exports = {
    addSchoolGet:(req,res) =>{
        res.render('admin/school/add');
    },
    addSchoolPost:(req,res) =>{
        let addSchoolArgs = req.body;
        School.create(addSchoolArgs).then(schools =>{
            res.redirect('/');
        });

    },
};

