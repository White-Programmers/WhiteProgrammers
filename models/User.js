const mongoose = require('mongoose');
const Role = mongoose.model('Role');
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        salt: {type: String, required: true},
        roles: [{type: mongoose.Schema.Types.ObjectId, ref:'Role'}],
        school: {type: [mongoose.Schema.Types.ObjectId], ref: 'School'},
        posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'Post'},
        banned: {type: Boolean}
    }
);

userSchema.method ({
    authenticate: function (password) {
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        let isSamePasswordHash = inputPasswordHash === this.passwordHash;

        return isSamePasswordHash;
    },

    isInRole: function (roleName) {
        return Role.findOne({name: roleName}).then(role => {
            if (!role){
                return false;
            }

            let isInRole = this.roles.indexOf(role.id) !== -1;
            return isInRole;
        })
    },

    isBanned: function () {
        if (!this.banned) {
            return false;
        }

        return true;
    },

    prepareDelete: function () {
        const Post = mongoose.model('Post');

        for (let role of this.roles) {
            Role.findById(role).then(role => {
                role.users.remove(this.id);
                role.save();
            })
        }

        for (let post of this.posts) {
            Post.findById(post).then(post => {
                post.remove();
            });
        }
    }
});

userSchema.set('versionKey', false);
const User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.seedAdmin = () => {
    let email = 'admin@cheating.bg';
    User.findOne({email: email}).then(admin => {
        if (!admin) {
            Role.findOne({name: 'Admin'}).then(role => {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('admin', salt);

                let roles = [];
                roles.push(role.id);

                let user = {
                    email: email,
                    passwordHash: passwordHash,
                    fullName: 'Admin',
                    articles: [],
                    salt: salt,
                    roles: roles
                };

                User.create(user).then(user => {
                    role.users.push(user.id);
                    role.save(err =>{
                        if(err) {
                            console.log(err.message);
                        } else {
                            console.log('Admin seeded successfully!')
                        }
                    });
                })
            })
        }
    })
};



