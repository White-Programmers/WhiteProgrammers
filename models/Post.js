const mongoose = require('mongoose');

let postSchema = mongoose.Schema(
    {
        title:{type: String, required: true},
        content:{type: String},
        author:{type: mongoose.Schema.Types.ObjectId, required: true,ref:'User'},
        subject: {type: String},
        classLevel: {type: String},
        imgUrl:{type: String},
        date:{type: Date, default: Date.now()}
    }
);

postSchema.method({
    prepareInsert: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user =>{
            if(user){
                user.posts.push(this.id);
                user.save();
            }
        });
    },

    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author.id).then(user =>{
            if(user){
                user.posts.remove(this.id);
                user.save();
            }
        });
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;