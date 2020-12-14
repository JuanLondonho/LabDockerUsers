(function() {
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        nit: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: false,
        }
    });

    module.exports = mongoose.model('users', userSchema);
})();