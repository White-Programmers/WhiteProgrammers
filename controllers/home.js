const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = {
  index: (req, res) => {
      Post.find({}).populate('author').then(posts =>{
          res.render('home/index',{posts:posts});
      });
  }
};