const mongoose = require('mongoose');
const schema = mongoose.Schema;
const skillsAndKnowledgeTrainingSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        employeeName: {
                type: String,
        },
        hoursCompleted: {
                type: Number,
        },
        companyName: {
                type: String,
        },
        selectedTrainingTopics: [{
                type: String,
                enum: [
                        'Protect resident rights',
                        'Provide treatment that promotes resident dignity, independence, individuality, strengths, privacy and choice',
                        'Recognize obvious symptoms of a mental disorder, personality disorder, or substance abuse',
                        'Provide the behavioral health services that the agency is authorized to provide and that the staff member is qualified to provide',
                        'Meet the unique needs of the resident populations served by the agency or the staff member, adults age 18 and older, individuals who have substance abuse problems, individuals who are seriously mentally ill, or individuals who have co-occurring disorders',
                        'Protect and maintain the confidentiality of resident records and information',
                        'Recognize and respect cultural differences',
                        'Recognize, prevent, and respond to a situation in which a resident may be a danger to self or others, behaves aggressively or destructively, may be experiencing a crisis or medical emergency',
                        'Read and implement a resident’s treatment plan',
                        'Assist a resident in accessing community services and resources',
                        'Record and document resident information',
                        'Demonstrate ethical behavior, such as by respecting staff member and resident boundaries and recognizing the inappropriateness of receiving gratuities from a resident',
                        'Identify types of medications commonly prescribed for mental disorders, personality disorders, and substance abuse, and the common side effects and adverse reactions of the medications',
                        'Recognize and respond to a fire, disaster, hazard, and medical emergency',
                        'Provide the activities or behavioral health services identified in the staff member’s job description or the agency’s policies and procedures',
                        'Being able to conduct group counseling',
                ],
        }],
        verificationMethod: {
                type: String,
                enum: [
                        'Visual observation of the staff member interacting with another individual, such as through role-playing exercises',
                        'Verbal interaction with the staff member, such as interviewing, discussion, or question and answer',
                ],
        },
        employeeSignature: {
                type: String,
        },
        employeeTitle: {
                type: String,
        },
        employeeDate: {
                type: Date,
                default: Date.now,
        },
        verifiedBySignature: {
                type: String,
        },
        verifiedByTitle: {
                type: String,
        },
        verifiedByDate: {
                type: Date,
                default: Date.now,
        },
});
const SkillsAndKnowledgeTraining = mongoose.model('SkillsAndKnowledgeTraining', skillsAndKnowledgeTrainingSchema);
module.exports = SkillsAndKnowledgeTraining;
