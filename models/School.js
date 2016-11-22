const mongoose = require('mongoose');

let schoolSchema = mongoose.Schema(
    {
        name: {type: String, required: true,unique: true},
        users: [{type:[mongoose.Schema.Types.ObjectId],ref: 'User'}],
        city: {type:[mongoose.Schema.Types.ObjectId],ref: 'City'}
    }
);

const School = mongoose.model('School',schoolSchema);
module.exports = School;