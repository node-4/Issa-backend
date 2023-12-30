const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
        {
                title: {
                        type: String,
                },
                description: {
                        type: String,
                },
                faq: [{
                        question: {
                                type: String,
                        },
                        answer: {
                                type: String,
                        }
                }],
                link: {
                        type: String,
                },
        },
        { timestamps: true }
);
module.exports = mongoose.model("FAQ", faqSchema);