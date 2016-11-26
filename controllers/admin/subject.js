const Subject = require('mongoose').model('Subject');

module.exports = {
    addSubjectGet:(req,res) =>{
      res.render('admin/subject/add');
    },
    addSubjectPost:(req,res) =>{
      let addSubjectArgs = req.body;
        Subject.create(addSubjectArgs).then(subjects =>{
            res.redirect('/');
        });

    },
};
