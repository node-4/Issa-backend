const mongoose = require('mongoose');
const schema = mongoose.Schema;
const blogSchema = mongoose.Schema({
        blogCategoryId: {
                type: schema.Types.ObjectId,
                ref: "blogCategory",
        },
        title: {
                type: String,
        },
        description: {
                type: String,
        },
        descriptionArray: [{
                title: {
                        type: String,
                },
                description: {
                        type: String,
                },
                image: {
                        type: String,
                },
        }],
        image: {
                type: String
        },
        type: {
                type: String,
                enum: ["Notes", "Main", "blog"]
        },
}, { timestamps: true })
module.exports = mongoose.model('blog', blogSchema)