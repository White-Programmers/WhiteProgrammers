const School = require('mongoose').model('School');
const Subject = require('mongoose').model('Subject');
const Post = require('mongoose').model('Post');

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

    resultsGet: (req, res) => {
        let searchArgs = req.body;
        let searchedPosts = [];

        Post.find({}).populate('school').populate('subject').populate('author').then(posts => {
            for(let post of posts) {
                if (post.school.id === searchArgs.school &&
                    post.subject.id === searchArgs.subject &&
                    post.classLevel === searchArgs.classLevel) {
                    searchedPosts.push(post);
                }
            }

            res.render('home/results', {searchedPosts: searchedPosts});
        });
    },

    viewPostGet: (req, res) => {
        let id = req.params.id;

        Post.findById(id).populate('school').populate('subject').then(post => {
            School.find({}).then(schools =>{

                for (let school of schools) {

                    if(school.id === post.school.id)
                    {
                        school.isActive = true;

                    }else
                    {
                        school.isActive = false;
                    }
                }

                Subject.find({}).then(subjects =>{
                    for (let subject of subjects) {

                        if(subject.id === post.subject.id)
                        {
                            subject.isActive = true;

                        }else
                        {
                            subject.isActive = false;
                        }
                    }
                    res.render('home/view', {post: post, schools: schools, subjects: subjects});
                });
            });
        });

    },
};