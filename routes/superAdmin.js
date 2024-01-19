const auth = require("../controller/superAdminController");
const authJwt = require("../middleware/authJwt");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
module.exports = (app) => {
        app.post('/api/v1/superAdmin/registration', auth.registration);
        app.post('/api/v1/superAdmin/signin', auth.signin);
        app.get('/api/v1/superAdmin/getProfile', authJwt.verifyToken, auth.getProfile);
        app.post('/api/v1/superAdmin/createAdmin', authJwt.verifyToken, auth.createAdmin);
        app.get('/api/v1/superAdmin/getAdmin', authJwt.verifyToken, auth.getAdmin);
        app.get('/api/v1/superAdmin/getAdminById/:id', authJwt.verifyToken, auth.getAdminById);
        app.delete('/api/v1/superAdmin/deleteAdmin/:id', authJwt.verifyToken, auth.deleteAdmin);
        app.get('/api/v1/superAdmin/getAdminTracking', authJwt.verifyToken, auth.getAdminTracking);
        app.get('/api/v1/superAdmin/getAdmitDetails', authJwt.verifyToken, auth.getAdmitDetails);
        app.get('/api/v1/superAdmin/getAllNotes', authJwt.verifyToken, auth.getAllNotes);
        app.get('/api/v1/superAdmin/getAllReceipt', authJwt.verifyToken, auth.getAllReceipt);
        app.post('/api/v1/superAdmin/addPackage', authJwt.verifyToken, upload.single('image'), auth.addPackage);
        app.get('/api/v1/superAdmin/getPackageById/:id', auth.getPackageById);
        app.get('/api/v1/superAdmin/getAllPackage', auth.getAllPackage);
        app.delete('/api/v1/superAdmin/deletePackage/:id', authJwt.verifyToken, auth.deletePackage);
        app.post('/api/v1/superAdmin/addBhrfTherapy', authJwt.verifyToken, auth.addBhrfTherapy);
        app.get('/api/v1/superAdmin/getBhrfTherapyById/id', auth.getBhrfTherapyById)
        app.get('/api/v1/superAdmin/getAllBhrfTherapy', auth.getAllBhrfTherapy);
        app.delete('/api/v1/superAdmin/deleteBhrfTherapy/:id', authJwt.verifyToken, auth.deleteBhrfTherapy);
        app.post('/api/v1/superAdmin/addBhrfTherapyTopic', authJwt.verifyToken, auth.addBhrfTherapyTopic);
        app.get('/api/v1/superAdmin/getBhrfTherapyTopicById/id', auth.getBhrfTherapyTopicById)
        app.get('/api/v1/superAdmin/getAllBhrfTherapyTopic', auth.getAllBhrfTherapyTopic);
        app.delete('/api/v1/superAdmin/deleteBhrfTherapyTopic/:id', authJwt.verifyToken, auth.deleteBhrfTherapyTopic);
        app.post("/api/v1/News/addNews", [authJwt.verifyToken], upload.single('image'), auth.createNews);
        app.get("/api/v1/News/getNews", auth.getNews);
        app.get("/api/v1/News/getIdNews/:id", auth.getIdNews);
        app.put("/api/v1/News/updateNews/:id", [authJwt.verifyToken], upload.single('image'), auth.updateNews);
        app.delete("/api/v1/News/deleteNews/:id", [authJwt.verifyToken], auth.deleteNews);
        app.post("/api/v1/ContactDetails/addContactDetails", [authJwt.verifyToken], upload.single('image'), auth.addContactDetails);
        app.get("/api/v1/ContactDetails/viewContactDetails", auth.viewContactDetails);
        app.post('/api/v1/superAdmin/addFaq', authJwt.verifyToken, auth.addFaq);
        app.get('/api/v1/superAdmin/getFaqById/:id', auth.getFaqById);
        app.delete('/api/v1/superAdmin/deleteFaq/:id', authJwt.verifyToken, auth.deleteFaq);
        app.get('/api/v1/superAdmin/getAllFaq', auth.getAllFaq);
        app.put("/api/v1/superAdmin/addQuestionAnswerInFaq", authJwt.verifyToken, auth.addQuestionAnswerInFaq);
        app.delete("/api/v1/superAdmin/deleteQuestionAnswerInFaq/:faqId", authJwt.verifyToken, auth.deleteQuestionAnswerInFaq);
        app.post("/api/v1/BlogCategory/createBlogCategory", [authJwt.verifyToken], upload.single('image'), auth.createBlogCategory);
        app.get("/api/v1/BlogCategory/getBlogCategory", auth.getBlogCategory);
        app.get("/api/v1/BlogCategory/getIdBlogCategory/:id", auth.getIdBlogCategory);
        app.put("/api/v1/BlogCategory/updateBlogCategory/:id", [authJwt.verifyToken], upload.single('image'), auth.updateBlogCategory);
        app.delete("/api/v1/BlogCategory/deleteBlogCategory/:id", [authJwt.verifyToken], auth.deleteBlogCategory);
        app.post("/api/v1/Blog/createBlogNotes", [authJwt.verifyToken], upload.single('image'), auth.createBlogNotes);
        app.post("/api/v1/Blog/createBlogMain", [authJwt.verifyToken], auth.createBlogMain);
        app.get("/api/v1/Blog/getBlogNotes", auth.getBlogNotes);
        app.get("/api/v1/Blog/getBlogMain", auth.getBlogMain);
        app.get("/api/v1/Blog/getBlogPopular", auth.getBlogPopular);
        app.get("/api/v1/Blog/getIdBlog/:id", auth.getIdBlog);
        app.delete("/api/v1/Blog/deleteBlog/:id", [authJwt.verifyToken], auth.deleteBlog);
        app.post("/api/v1/Blog/createBlog", [authJwt.verifyToken], upload.single('image'), auth.createBlog);
        app.get("/api/v1/Blog/getBlog", auth.getBlog);
        app.put("/api/v1/Blog/updateBlog/:id", [authJwt.verifyToken], upload.single('image'), auth.updateBlog);
        app.put("/api/v1/superAdmin/addDescriptionArrayInBlog/:id", authJwt.verifyToken, auth.addDescriptionArrayInBlog);
        app.delete("/api/v1/superAdmin/deleteDescriptionArrayInBlog/:id/:descriptionArrayId", authJwt.verifyToken, auth.deleteDescriptionArrayInBlog);
        app.post("/api/v1/Ebook/createEbook", [authJwt.verifyToken], upload.single('image'), auth.createEbook);
        app.get("/api/v1/Ebook/getEbook", auth.getEbook);
        app.get("/api/v1/Ebook/getIdEbook/:id", auth.getIdEbook);
        app.put("/api/v1/Ebook/updateEbook/:id", [authJwt.verifyToken], upload.single('image'), auth.updateEbook);
        app.delete("/api/v1/Ebook/deleteEbook/:id", [authJwt.verifyToken], auth.deleteEbook);
        app.post('/api/v1/DemoRequest/createDemoRequest', auth.createDemoRequest);
        app.get('/api/v1/DemoRequest/getDemoRequest', authJwt.verifyToken, auth.getDemoRequest);
        app.put('/api/v1/DemoRequest/demoRequestClose/:id', authJwt.verifyToken, auth.demoRequestClose);
        app.get('/api/v1/DemoRequest/getIdDemoRequest/:id', authJwt.verifyToken, auth.getIdDemoRequest);
        app.delete('/api/v1/DemoRequest/deleteDemoRequest/:id', authJwt.verifyToken, auth.deleteDemoRequest);
        app.post("/api/v1/Pricing/PricingFAQ/create", [authJwt.verifyToken], auth.createPricingFAQ);
        app.get('/api/v1/Pricing/getPricingFAQ', auth.getPricingFAQ);
        app.put("/api/v1/Pricing/addFaqInPricingFAQ", authJwt.verifyToken, auth.addFaqInPricingFAQ);
        app.delete("/api/v1/Pricing/deleteFaqsInPricingFAQ/:faqsId", authJwt.verifyToken, auth.deleteFaqsInPricingFAQ);
        app.post('/api/v1/Pricing/createPricing', authJwt.verifyToken, auth.createPricing);
        app.get('/api/v1/Pricing/getPricing', auth.getPricing);
        app.get('/api/v1/Pricing/getIdPricing/:id', auth.getIdPricing);
        app.delete('/api/v1/Pricing/deletePricing/:id', authJwt.verifyToken, auth.deletePricing);
        app.post('/api/v1/Pricing/calculatePricing', auth.calculatePricing);
        app.post("/api/v1/OasisNotesSupport/addOasisNotesSupport", [authJwt.verifyToken], auth.createOasisNotesSupport);
        app.get("/api/v1/OasisNotesSupport/getOasisNotesSupport", auth.getOasisNotesSupport);
        app.get("/api/v1/OasisNotesSupport/getIdOasisNotesSupport/:id", auth.getIdOasisNotesSupport);
        app.put("/api/v1/OasisNotesSupport/updateOasisNotesSupport/:id", [authJwt.verifyToken], auth.updateOasisNotesSupport);
        app.delete("/api/v1/OasisNotesSupport/deleteOasisNotesSupport/:id", [authJwt.verifyToken], auth.deleteOasisNotesSupport);
        app.post("/api/v1/OurFeatures/addOurFeatures", [authJwt.verifyToken], upload.single('image'), auth.createOurFeatures);
        app.get("/api/v1/OurFeatures/getOurFeatures", auth.getOurFeatures);
        app.get("/api/v1/OurFeatures/getIdOurFeatures/:id", auth.getIdOurFeatures);
        app.put("/api/v1/OurFeatures/updateOurFeatures/:id", [authJwt.verifyToken], upload.single('image'), auth.updateOurFeatures);
        app.delete("/api/v1/OurFeatures/deleteOurFeatures/:id", [authJwt.verifyToken], auth.deleteOurFeatures);
        app.post("/api/v1/Banner/createTopBanner", [authJwt.verifyToken], upload.single('image'), auth.createTopBanner);
        app.post("/api/v1/Banner/createBottomBanner", [authJwt.verifyToken], upload.single('image'), auth.createBottomBanner);
        app.get("/api/v1/Banner/getBanner", auth.getBanner);
        app.get("/api/v1/Banner/getTopBanner", auth.getTopBanner);
        app.get("/api/v1/Banner/getBottomBanner", auth.getBottomBanner);
        app.get("/api/v1/Banner/getIdBanner/:id", auth.getIdBanner);
        app.delete("/api/v1/Banner/deleteBanner/:id", [authJwt.verifyToken], auth.deleteBanner);
        app.post("/api/v1/TrustedClient/addTrustedClient", [authJwt.verifyToken], upload.single('image'), auth.createTrustedClient);
        app.get("/api/v1/TrustedClient/getTrustedClient", auth.getTrustedClient);
        app.get("/api/v1/TrustedClient/getIdTrustedClient/:id", auth.getIdTrustedClient);
        app.put("/api/v1/TrustedClient/updateTrustedClient/:id", [authJwt.verifyToken], upload.single('image'), auth.updateTrustedClient);
        app.delete("/api/v1/TrustedClient/deleteTrustedClient/:id", [authJwt.verifyToken], auth.deleteTrustedClient);
        app.post("/api/v1/AboutUs/addAboutUs", [authJwt.verifyToken], upload.single('image'), auth.createAboutUs);
        app.get("/api/v1/AboutUs/getAboutUs", auth.getAboutUs);
        app.get("/api/v1/AboutUs/getIdAboutUs/:id", auth.getIdAboutUs);
        app.delete("/api/v1/AboutUs/deleteAboutUs/:id", [authJwt.verifyToken], auth.deleteAboutUs);
        app.put("/api/v1/AboutUs/addInfoInAboutUs", authJwt.verifyToken, upload.single('image'), auth.addInfoInAboutUs);
        app.delete("/api/v1/AboutUs/deleteInfoInAboutUs/:infoId", authJwt.verifyToken, auth.deleteInfoInAboutUs);
        app.put("/api/v1/AboutUs/addCateInAboutUs", authJwt.verifyToken, upload.single('image'), auth.addCateInAboutUs);
        app.delete("/api/v1/AboutUs/deleteCateInAboutUs/:cateId", authJwt.verifyToken, auth.deleteCateInAboutUs);
        app.post("/api/v1/WhyChoosePharm/addWhyChoosePharm", [authJwt.verifyToken], auth.createWhyChoosePharm);
        app.get("/api/v1/WhyChoosePharm/getWhyChoosePharm", auth.getWhyChoosePharm);
        app.get("/api/v1/WhyChoosePharm/getIdWhyChoosePharm/:id", auth.getIdWhyChoosePharm);
        app.delete("/api/v1/WhyChoosePharm/deleteWhyChoosePharm/:id", [authJwt.verifyToken], auth.deleteWhyChoosePharm);
        app.delete("/api/v1/WhyChoosePharm/deleteDataArrayInWhyChoosePharm/:dataArrayId", authJwt.verifyToken, auth.deleteDataArrayInWhyChoosePharm);
        app.post("/api/v1/Partner/addPartner", [authJwt.verifyToken], auth.createPartner);
        app.get("/api/v1/Partner/getPartner", auth.getPartner);
        app.get("/api/v1/Partner/getIdPartner/:id", auth.getIdPartner);
        app.delete("/api/v1/Partner/deletePartner/:id", [authJwt.verifyToken], auth.deletePartner);
        app.put("/api/v1/Partner/addDataInPartner", authJwt.verifyToken, upload.single('image'), auth.addDataInPartner);
        app.delete("/api/v1/Partner/deleteDataArrayInPartner/:dataArrayId", authJwt.verifyToken, auth.deleteDataArrayInPartner);
        app.post("/api/v1/DownloadPage/createDownloadPage", [authJwt.verifyToken], auth.createDownloadPage);
        app.get("/api/v1/DownloadPage/getDownloadPage", auth.getDownloadPage);
        app.get("/api/v1/DownloadPage/getIdDownloadPage/:id", auth.getIdDownloadPage);
        app.delete("/api/v1/DownloadPage/deleteDownloadPage/:id", [authJwt.verifyToken], auth.deleteDownloadPage);
        app.post("/api/v1/AboutUsOasisNotesSupport/create", [authJwt.verifyToken], auth.createAboutUsOasisNotesSupport);
        app.get("/api/v1/AboutUsOasisNotesSupport/get", auth.getAboutUsOasisNotesSupport);
        app.put("/api/v1/AboutUsOasisNotesSupport/edit/:id", auth.editAboutUsOasisNotesSupport);
        app.get("/api/v1/AboutUsOasisNotesSupport/getId/:id", auth.getIdAboutUsOasisNotesSupport);
        app.delete("/api/v1/AboutUsOasisNotesSupport/delete/:id", [authJwt.verifyToken], auth.deleteAboutUsOasisNotesSupport);
        app.put("/api/v1/AboutUsOasisNotesSupport/addData/:id", authJwt.verifyToken, auth.addDataInAboutUsOasisNotesSupport);
        app.delete("/api/v1/AboutUsOasisNotesSupport/deleteData/:id/:dataArrayId", authJwt.verifyToken, auth.deleteDataArrayInAboutUsOasisNotesSupport);
}