var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: 'dtijhcmaa', api_key: '624644714628939', api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY', });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "shahina/images/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF", "svg", "SVG"], }, });
const upload = multer({ storage: storage });
const FranchiseUpload = upload.fields([{ name: 'image', maxCount: 20 }, { name: 'image1', maxCount: 1 }]);
const productUpload = upload.fields([{ name: 'images', maxCount: 20 }, { name: 'featureImage', maxCount: 30 }]);
const brandUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]);
const guideUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }]);


const employeeTrackingUpload = upload.fields([
        { name: "CPRFirstAid", maxCount: 1 },
        { name: "TBTestChestXray", maxCount: 1 },
        { name: "TBtestQuestionnaire", maxCount: 1 },
        { name: "FingerprintClearanceCard", maxCount: 1 },
        { name: "TBAnnualEducation", maxCount: 1 },
        { name: "InfectiousControlTraining", maxCount: 1 },
        { name: "FallPreventionandFallRecovery", maxCount: 1 },
        { name: "APSSearch", maxCount: 1 },
        { name: "CPIPreventionandControl", maxCount: 1 },
        { name: "Annualabuseandneglecttraining", maxCount: 1 },
        { name: "vacationPersonalTimeUsed", maxCount: 1 },
]);
module.exports = { upload, FranchiseUpload, productUpload, employeeTrackingUpload, brandUpload, guideUpload };