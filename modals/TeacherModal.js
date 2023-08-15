const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const teacherSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Name is Required'],
    },
    Email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true]
    },
    Password: {
        type: String,
        minlength: 6,
        required: [true, "Password Is Required"]
    },
    MobileNumber: {
        type: Number,
        maxlength: 10
    },
    Photo: {
        dataBuffer: {
            type: Buffer,
        },
        contentType: {
            type: String,
        }
    },
    Subject: {
        type: String,
    },
});

// Encrypt password
teacherSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

// sign jwt and return 
teacherSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, 'secret', {
        expiresIn: '120m'
    });
};


//we are using bcrypt library, another function of checking the password entered with the password in database
teacherSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);

};


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
