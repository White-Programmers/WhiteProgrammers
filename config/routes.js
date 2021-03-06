const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin');
const postController = require('./../controllers/post');
const subjectController = require('./../controllers/admin/subject');
const schoolController = require('./../controllers/admin/school');
const multer = require('multer'); // ???    not working in app.js

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/homepage/homepage', homeController.homepage);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/post/new',postController.postCreateGet);
    //app.post('/post/new',postController.postCreatePost);

    app.get('/post/details/:id',postController.details);
    app.post('/post/new', multer({ dest: './uploads/'}).single('upl'), postController.postCreatePost);

    app.post('/results', homeController.resultsGet);

    app.get('/view/:id', homeController.viewPostGet);

    app.use((req, res, next) => {
        if(req.isAuthenticated()) {
            req.user.isInRole('Admin').then(isAdmin => {
                if (isAdmin) {
                    next();
                } else {
                    res.redirect('/');
                }
            })
        } else {
            res.redirect('/user/login');
        }
    });

    app.get('/admin/user/all', adminController.user.all);

    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);

    app.get('/admin/user/ban/:id', adminController.user.ban);
    app.get('/admin/user/unban/:id', adminController.user.unban);

    app.get('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/post/all', adminController.post.all);

    app.get('/admin/post/edit/:id', adminController.post.editGet);
    app.post('/admin/post/edit/:id', multer({ dest: './uploads/'}).single('file'), adminController.post.editPost);

    app.get('/admin/post/delete/:id',adminController.post.postDelete);

    app.get('/admin/subject/add',subjectController.addSubjectGet);
    app.post('/admin/subject/add',subjectController.addSubjectPost);

    app.get('/admin/school/add',schoolController.addSchoolGet);
    app.post('/admin/school/add',schoolController.addSchoolPost);

};

