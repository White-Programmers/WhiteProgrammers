const mongoose = require('mongoose');

let citySchema = mongoose.Schema(
    {
        name: {type: String, required: true,unique: true},
        users: [{type:[mongoose.Schema.Types.ObjectId],ref: 'User'}]
    }
);

const City = mongoose.model('City',citySchema);
module.exports = City;