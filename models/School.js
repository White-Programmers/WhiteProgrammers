const mongoose = require('mongoose');

let schoolSchema = mongoose.Schema(
    {
        name: {type: String, required: true,unique: true},
        users: [{type:[mongoose.Schema.Types.ObjectId],ref: 'User'}]
    }
);

const School = mongoose.model('School',schoolSchema);
module.exports = School;