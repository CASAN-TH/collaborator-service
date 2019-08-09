'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CollaboratorSchema = new Schema({
    email: {
        type: String,
        required: 'Please fill a Collaborator email',
    },
    role:{
        type:String,
        enum:["member","owner"],
        default:"member"
    },
    status:{
        type:String,
        enum:["invite","join","cancel"],
        default:"invite"
    },
    link:{
        type:String,
        default:"localhost"
    },
    schoolid:{
        type:String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Collaborator", CollaboratorSchema);