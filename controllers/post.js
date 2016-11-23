const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = {
  postCreateGet:(req,res) => {
        if(req.isAuthenticated()){
               res.render('post/create');
        }
        else{
            res.redirect(200,'/');
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
            errMsg = 'Please enter content';
        }
        else if(!createPostArgs.imgUrl){
            errMsg = 'Please add image url';
        }

        if (errMsg) {
            createPostArgs.error = errMsg;
            res.render('post/new', createPostArgs);
            return;
        }

        createPostArgs.author = req.user.id;

        Post.create(createPostArgs).then(post => {
            post.prepareInsert();
            req.user.posts.push(post.id);
            req.user.save(err => {
                if (err) {
                    res.redirect(200,'/', {error: errMsg});
                }
                else {
                    res.redirect(200,'/');
                }
            });
        });
    },
};