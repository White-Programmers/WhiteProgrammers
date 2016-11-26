const mongoose = require('mongoose');

let subjectSchema = mongoose.Schema(
    {
        name: {type: String, required: true,unique: true}
    }
);

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;


