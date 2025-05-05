const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const reviewSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 确保一个用户只能对一本书评价一次
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.plugin(paginate);

// 更新图书的平均评分
reviewSchema.post('save', async function() {
    const bookId = this.book;
    const Book = mongoose.model('Book');
    
    const stats = await this.constructor.aggregate([
        {
            $match: { book: bookId }
        },
        {
            $group: {
                _id: '$book',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);
    
    if (stats.length > 0) {
        await Book.findByIdAndUpdate(bookId, {
            averageRating: stats[0].avgRating,
            totalRatings: stats[0].count
        });
    } else {
        await Book.findByIdAndUpdate(bookId, {
            averageRating: 0,
            totalRatings: 0
        });
    }
});

// 删除评论后更新图书的平均评分
reviewSchema.post('remove', async function() {
    await this.constructor.post('save').apply(this);
});

module.exports = mongoose.model("Review", reviewSchema);
