const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mailerSchema = new Schema({
    people: [{
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Mailer', mailerSchema);