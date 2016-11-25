const Post = require('mongoose').model('Post');

module.exports = {
    all: (req, res) => {
        Post.find({}).populate('author').then(posts => {
            res.render('admin/post/all', {posts: posts});
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Post.findById(id).then(post => {
                res.render('admin/post/edit', {post: post});
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

