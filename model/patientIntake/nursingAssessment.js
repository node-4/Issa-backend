const mongoose = require('mongoose');
const schema = mongoose.Schema;
const nursingAssessmentSchema = new mongoose.Schema({
        employeeId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        patientId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        adminId: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        /////////////////////////////////////// first box//////////////////////
        todayDate: { type: Date, },
        admissionDate: { type: Date, },
        residentFullName: { type: String, },
        dateOfBirth: { type: Date, },
        age: { type: Number, },
        sex: { type: String, enum: ["Male", "Female", "Other"], },
        admissionDiagnoses: { type: String },
        codeStatus: [{
                type: String,
                enum: ['Full Code', 'DNR'],
        }],
        lastTBScreeningDate: { type: Date },
        tbScreeningResults: { type: String, enum: ['Negative', 'Positive', 'Pending'] },
        careProvided: [{
                type: String,
                enum: ['PhysicalServices', 'BehavioralHealthServices'],
        }],
        //////////////////////////////////////////////////// vitals box ///////////////////////
        vitalsBloodPressure: { type: String },
        vitalsPulse: { type: String },
        vitalsRespiratoryRate: { type: String },
        vitalsOxygenLevel: { type: String },
        vitalsTemperature: { type: String },
        vitalsWeight: { type: Number },
        vitalsHeightFeet: { type: Number },
        vitalsHeightInches: { type: Number },
        allergies: { type: String },
        /////////////////////////////////////////////////////////////
        reviewOfSystemsConstitutional: {
                type: String,
                enum: ['DENIES', 'Fever', 'Poor appetite', 'Unexplained weight gain', 'Fatigue', 'Chills', 'Change in appetite', 'Night Sweats', 'Unexplained weight loss'],
                default: 'DENIES'
        },
        reviewOfSystemsConstitutionalComment: {
                type: String
        },
        reviewOfSystemsCardiovascular: {
                type: String,
                enum: ['DENIES', 'Chest pain', 'Shortness of breath', 'Racing Pulse', 'Swelling of the feet/hands', 'Irregular heartbeat'],
                default: 'DENIES'
        },
        reviewOfSystemsCardiovascularComment: {
                type: String
        },
        reviewOfSystemsEndocrine: { type: String, enum: ['DENIES', 'Excess thirst', 'Excessive urination', 'Heat Intolerance', 'Cold Intolerance', 'Hair loss', 'Dry skin'], default: 'DENIES' },
        reviewOfSystemsEndocrineComment: {
                type: String
        },
        reviewOfSystemsGastrointestinal: { type: String, enum: ['DENIES', 'Abdominal pain', 'Nausea', 'Diarrhea', 'Bloody stools', 'Stomach Ulcers', 'Constipation', 'Trouble Swallowing', 'Jaundice/yellow skin'], default: 'DENIES' },
        reviewOfSystemsGastrointestinalComment: {
                type: String
        },
        reviewOfSystemsGenitourinary: { type: String, enum: ['DENIES', 'Genital sores or ulcers', 'Kidney failure/problems', 'Kidney stones', 'Painful/difficult urination', 'Testicular pain', 'Urinary discharge'], default: 'DENIES' },
        reviewOfSystemsGenitourinaryComment: {
                type: String
        },
        reviewOfSystemsHematologyOncology: { type: String, enum: ['DENIES', 'Easy bruising', 'Prolonged bleeding'], default: 'DENIES' },
        reviewOfSystemsHematologyOncologyomment: {
                type: String
        },
        reviewOfSystemsHeadNeckThroat: { type: String, enum: ['DENIES', 'Hearing loss', 'Sore throat', 'Runny nose', 'Dry mouth', 'Jaw Claudication', 'Earache', 'Missing teeth'], default: 'DENIES' },
        reviewOfSystemsHeadNeckThroatComment: {
                type: String
        },
        reviewOfSystemsIntegumentary: { type: String, enum: ['DENIES', 'Rash', 'Change in mole', 'Skin sores', 'Skin cancer', 'Severe itching', 'Loss of hair'], default: 'DENIES' },
        reviewOfSystemsIntegumentaryComment: {
                type: String
        },
        reviewOfSystemsMusculoskeletal: { type: String, enum: ['DENIES', 'Muscle aches', 'Difficulty laying flat due to muscle pain', 'Back pain', 'Joint pain', 'Deformities'], default: 'DENIES' },
        reviewOfSystemsMusculoskeletalComment: {
                type: String
        },
        reviewOfSystemsPsychiatric: { type: String, enum: ['DENIES', 'Insomnia', 'Irritability', 'Depression', 'Anxiety', 'Recurrent bad thoughts', 'Mood swings', 'Hallucinations', 'Compulsions'], default: 'DENIES' },
        reviewOfSystemsPsychiatricComment: {
                type: String
        },
        reviewOfSystemsNeurologic: { type: String, enum: ['DENIES', 'Weakness', 'Headaches', 'Scalp tenderness', 'Dizziness', 'Problems with balance', 'Paralysis of extremities', 'Tremor', 'Stroke', 'Numbness or tingling', 'Seizures or convulsions', 'Fainting', 'Problems walking'], default: 'DENIES' },
        reviewOfSystemsNeurologicComment: {
                type: String
        },
        reviewOfSystemsRespiratory: { type: String, enum: ['DENIES', 'Wheezing', 'Cough', 'Coughing up blood', 'Severe or Frequent colds', 'Difficulty breathing'], default: 'DENIES' },
        reviewOfSystemsRespiratoryComment: {
                type: String
        },
        reviewOfSystemsAllergicImmunologic: { type: String, enum: ['DENIES', 'Seasonal allergies', 'Hay fever symptoms', 'Itching', 'Frequent infections', 'Exposure to HIV'], default: 'DENIES' },
        reviewOfSystemsAllergicImmunologicComment: {
                type: String
        },
        suicidalRiskAssessmentDeniesSymptomsBellow: { type: Boolean },
        behavioralSymptoms: { type: String, enum: ['self-injuring', 'reckless behavior', 'impulsive behaviors', 'shifts in temperament', 'no longer enjoying previous activities', 'talking or writing about death'], default: [] },
        physicalSymptoms: { type: String, enum: ['insomnia', 'hypersomnia', 'changes in appetite', 'weight loss/gain', 'panic attacks'], default: [] },
        psychosocialSymptoms: { type: String, enum: ['helplessness/hopelessness', 'worthlessness', 'depression', 'anxiety', 'mood swings', 'Irritable', 'Resident contracts for safety', 'Resident Safety Plan to be completed within 48 hours of admission'], default: [] },
        currentMedications: { type: Boolean },
        nutritionDiet: { type: String, enum: ['As tolerated', 'Special diet'], default: 'As tolerated' },
        nutritionSpecialDietOrder: { type: String },
        nutritionFluidRestrictions: { type: Boolean },
        skinCheck: { type: String },
        residentDeniesSkinConcerns: { type: Boolean },
        front: { type: Boolean },
        back: { type: Boolean },
        sideLeft: { type: Boolean, default: false },
        sideRight: { type: Boolean, default: false },
        legFront: { type: Boolean, default: false },
        legBack: { type: Boolean, default: false },
        legLeft: { type: Boolean, default: false },
        legRight: { type: Boolean, default: false },
        legComment: {
                type: String
        },
        bhtName: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        bhtSignature: { type: String },
        bhpDate: { type: Date, default: Date.now },
        bhpTime: { type: String },
        rnName: {
                type: schema.Types.ObjectId,
                ref: "User",
        },
        rnSignature: { type: String },
        rnDate: { type: Date, default: Date.now },
        rnTime: { type: String },

        // covid19ScreeningSymptomsFeverOrChills: { type: Boolean },
        // covid19ScreeningSymptomsShortnessOfBreath: { type: Boolean },
        // covid19ScreeningSymptomsSoreThroat: { type: Boolean },
        // covid19ScreeningSymptomsDiarrhea: { type: Boolean },
        // covid19ScreeningSymptomsCough: { type: Boolean },
        // covid19ScreeningSymptomsBodyAches: { type: Boolean },
        // covid19ScreeningSymptomsCongestionOrRunnyNose: { type: Boolean },
        // covid19ScreeningSymptomsLossOfTasteOrSmell: { type: Boolean },
        // covid19ScreeningSymptomsFatigue: { type: Boolean },
        // covid19ScreeningSymptomsHeadache: { type: Boolean },
        // covid19ScreeningSymptomsNauseaOrVomiting: { type: Boolean },

});

const NursingAssessment = mongoose.model('nursingAssessment', nursingAssessmentSchema);
module.exports = NursingAssessment
