const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = 4000;
const config = require('./config/config.json');
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize(config.development);
const helper = require('./helper');
const upload = require('./middleware/multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerHelper('excerpt', helper.excerpt);
hbs.registerHelper('timeAgo', helper.timeAgo);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(session({
    name: 'KhAeaKHaTTine',
    secret: 'korewakaizokuogininaruatokoda',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 jam
    },
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.navData = {
        user: req.session.user
    }
    next();
});

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', home);
app.get('/project', project); 
app.get('/project/:id', project); 
app.get('/contact', contact);
app.get('/testimonials', testimonials);
app.get('/test/', test);
app.get('/test/:id', test);

app.get('/register', registerPage);
app.get('/login', loginPage);
app.post('/register', createNewUser);
app.post('/login', login);
app.get('/logout', logout);

app.post('/project', project);

app.get('/blog', blog);
app.get('/blog/:id', blogDetail);
app.post('/blog', upload, blogPost);
app.use('/blog-delete/:id', blogDelete);
app.get('/blog-edit/:id', upload, blogEdit);
app.post('/blog-edit/:id', blogUpdate);

const projectData = [
    {
        id: 1,
        project_name: 'project 1',
        start_date: '2024-10-01',
        end_date: '2024-10-31',
        description: 'ini deskripsi project',
        node_js: 'on',
        next_js: 'on',
        typescript: 'on',
        upload_image: '/img/smarphone.jpg',
    }
];

function home(req, res){
    console.log(req.session.user);
    res.render('index', { project: projectData }); 
}

function registerPage(req, res){
    res.render('register');
};

async function createNewUser(req, res){
    const { name, email, password } = req.body;
    console.log(name, email);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const query = `INSERT INTO users(name, email, password) VALUES(:name, :email, :password)`;
        const result = await sequelize.query(query, {
            type: QueryTypes.INSERT,
            replacements: { name, email, password: hashedPassword }
        });
        console.log('create new user success', result);
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.redirect('/register')
    }
}

function loginPage(req, res){
    res.render('login');
};

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const query = `SELECT * FROM users WHERE email = :email`;
        const theUser = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { email }
        });
        if(!theUser.length){
            req.flash('info', 'Invalid user');
            return res.redirect('/login');
        }
        const isValidPassword = await bcrypt.compare(password, theUser[0].password);
        if(!isValidPassword){
            req.flash('info', 'Invalid password');
            return res.redirect('/login');
        };
        req.session.user = theUser[0];
        res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/login')
    }
}

function logout(req, res){
    req.session.destroy(() => {
        console.log('logout success');
        res.redirect('/')
    });
};

function project(req, res){
    if(req.method === "GET"){
        return res.render('project', { project: projectData }); 
    } else if (req.method === "POST"){
        const { project_name, start_date, end_date, description, node_js, next_js, react_js, typescript, upload_image } = req.body;
        const data = {
            id: new Date().getTime(),
            project_name,
            start_date,
            end_date,
            description,
            technologies: {
                node_js,
                next_js,
                react_js,
                typescript, 
            },
            upload_image,
        }
        console.log(data);
        projectData.unshift(data);
        return res.render('project', { project: projectData }); 
    }
}

async function blog(req, res){
    const query = `SELECT * FROM blogs`
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render('blog', { blog: result });
}

async function blogPost(req, res) {
    const { title, content, author_id } = req.body;
    const author_id_num = parseInt(author_id);
    const image = `/uploads/${req.file.filename}`;
    try {
        const query = `INSERT INTO blogs(title, content, image, author_id) VALUES(:title, :content, :image, :author_id)`;
        const result = await sequelize.query(query, { 
            type: QueryTypes.INSERT,
            replacements: { title, content, image, author_id: author_id_num }
         });
         console.log('create new post success', result[0]);
         res.redirect('/blog');
    } catch (error) {
        console.log(error);
        res.redirect('/blog')
    }
};

async function blogDetail(req, res){
    const { id } = req.params;
    try {
        const query = `SELECT * FROM blogs WHERE id = :id`;
        const result = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });
        res.render('blog-detail', { data: result[0] });
    } catch (error) {
        console.log(error);
        res.redirect('/blog')
    }
};

async function blogEdit(req, res) {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM blogs WHERE id = :id`;
        const result = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });
        res.render('blog-edit', { data: result[0] });
    } catch (error) {
        console.log(error);
        res.redirect('/blog')
    }
};

async function blogUpdate(req, res) {
    const { id } = req.params;
    const { title, content, image, author_id } = req.body;
    const author_id_num = parseInt(author_id);
    const newImage = req.file.filename ? `/uploads/${req.file.filename}` : false;
    try {
        const query = `UPDATE blogs SET title=:title, content=:content, image=:image, author_id=:author_id WHERE id = :id`;
        await sequelize.query(query, { 
            type: QueryTypes.UPDATE,
            replacements: { title, content, image: newImage ? newImage : image, author_id: author_id_num, id }
         });
         console.log(`update post id: ${id} success`);
         res.redirect('/blog');
    } catch (error) {
        console.log(error);
        res.redirect('/blog')
    }
};

async function blogDelete(req, res) {
    const { id } = req.params;
    try {
        const query = `DELETE FROM blogs WHERE id = :id`;
        await sequelize.query(query, {
            type: QueryTypes.DELETE,
            replacements: { id }
        });
        res.redirect('/blog');
    } catch (error) {
        console.log(error);
        res.redirect('/blog')
    }
}

function contact(req, res){
    res.render('contact'); 
}

function testimonials(req, res){
    res.render('testimonials');
}

function test(req, res){
    const { id } = req.params;
    console.log(`params id: ${id}`);
    res.render('testing', { id: id ? `: ${id}` : null });
}

app.listen(port, () => console.log('Running on port: ' + port));
