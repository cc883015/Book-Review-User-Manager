const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        default: "https://covers.openlibrary.org/b/id/8091016-L.jpg"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
});

bookSchema.plugin(paginate);

module.exports = mongoose.model("Book", bookSchema);
