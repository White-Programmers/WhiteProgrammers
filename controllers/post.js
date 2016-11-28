const mongoose = require('mongoose');
const School = mongoose.model('School');
const Subject = mongoose.model('Subject');
const Post = mongoose.model('Post');

module.exports = {
    postCreateGet:(req,res) => {
            if(req.isAuthenticated()){
                School.find({}).then(schools =>{
                    Subject.find({}).then(subjects => {
                        res.render('post/create', {schools: schools, subjects: subjects});
                    });
                });
            }
        else{
            res.redirect('/');
        }
    },

    postCreatePost: (req, res) => {
        let createPostArgs = req.body;

        let errMsg = '';

        if (!req.isAuthenticated()) {
            errMsg = 'Please Login';
        }
        else if (!createPostArgs.title) {
            errMsg = 'Please enter title!';
        }
        else if (!createPostArgs.content) {
            errMsg = 'Please enter content!';
        }


        if (errMsg) {
            createPostArgs.error = errMsg;
            res.render('post/new', createPostArgs);
            return;
        }

        createPostArgs.author = req.user.id;
        createPostArgs.imgUrl = req.file.filename;

        Post.create(createPostArgs).then(post => {
            post.prepareInsert();
            req.user.posts.push(post.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: errMsg});
                }
                else {
                    res.redirect('/');
                }
            });
        });
    },

    details: (req, res) => {
        let id = req.params.id;
        Post.findById(id).populate('author').then(post => {
            res.render('post/details', {post: post});
        });
    },
};