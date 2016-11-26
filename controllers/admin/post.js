const Post = require('mongoose').model('Post');
const School = require('mongoose').model('School');
const Subject = require('mongoose').model('Subject');

module.exports = {
    all: (req, res) => {
        Post.find({}).populate('author').populate('school').populate('subject').then(posts => {
            res.render('admin/post/all', {posts: posts});
        });
    },

    editGet: (req, res) => {
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
                    res.render('admin/post/edit', {post: post, schools: schools, subjects: subjects});
                });
            });
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let postArgs = req.body;

        Post.findById(id).then(post => {
            post.title = postArgs.title;
            post.content = postArgs.content;
            post.subject = postArgs.subject;
            post.classLevel = postArgs.classLevel;
            post.school = postArgs.school;

            post.save((err) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.redirect('/admin/post/all');
                }
            })
        });
    },

    postDelete: (req, res) => {
        let id = req.params.id;
        Post.findById(id).populate('author').then(posts => {
            if (req.isAuthenticated()) {
                req.user.isInRole('Admin').then(isAdmin => {
                    if (isAdmin) {
                        posts.prepareDelete();
                        posts.remove();
                        res.redirect('/admin/post/all');
                    }
                });
            }
            else {
                res.redirect('/admin/post/all');
            }
        });
    },
};

