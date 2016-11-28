const School = require('mongoose').model('School');
const Subject = require('mongoose').model('Subject');

module.exports = {
    index: (req, res) => {
      School.find({}).then(schools => {
          Subject.find({}).then(subjects => {
             res.render('home/index', {schools: schools, subjects: subjects})
          });
      });
    },

    homepage: (req, res) => {
        res.render('homepage/homepage');
    },

};