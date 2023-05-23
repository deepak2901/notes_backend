const mongoose = require("mongoose");
const schema = mongoose.Schema;

const notesSchema = new schema({
    text : {
        type : "string",
        required : true
    }
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;