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
};

