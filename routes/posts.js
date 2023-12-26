const mongoose = require("mongoose");


let postSchema = new mongoose.Schema({
    caption: {
        type: String,
        require: true   
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: [] 
    }
});

module.exports = mongoose.model("post", postSchema);


