const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const port = 4000;
const config = require("./config/config");
const { Sequelize, QueryTypes } = require("sequelize");
const helper = require("./src/libs/helper");
const upload = require("./src/middlewares/multer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

require("dotenv").config();

const environment = process.env.NODE_ENV;

// const sequelize = new Sequelize(config.development);
const sequelize = new Sequelize(config[environment]);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));
hbs.registerHelper("excerpt", helper.excerpt);
hbs.registerHelper("timeAgo", helper.timeAgo);
hbs.registerHelper("formatDate", helper.formatDate);
hbs.registerHelper("calculateDuration", helper.calculateDuration);
hbs.registerHelper("eq", helper.eq);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "assets")));
app.use(
  session({
    name: "my-session",
    secret: "korewakaizokuogininaruatokoda",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.session = {
    user: req.session.user,
  };
  next();
});

hbs.registerPartials(path.join(__dirname, "src", "views", "partials"));

app.get("/", home);
app.get("/project/:id", project);
app.get("/contact", contact);
app.get("/testimonials", testimonials);
app.get("/test/", test);
app.get("/test/:id", test);

app.get("/register", registerPage);
app.get("/login", loginPage);
app.post("/register", createNewUser);
app.post("/login", login);
app.get("/logout", logout);

app.get("/project", project);
app.get("/project-detail/:id", projectDetail);
app.post("/project", upload, projectPost);
app.use("/project-delete/:id", projectDelete);
app.get("/project-edit/:id", projectEdit);
app.post("/project-update/:id", upload, projectUpdate);

app.get("/blog", blog);
app.get("/blog/:id", blogDetail);
app.post("/blog", upload, blogPost);
app.use("/blog-delete/:id", blogDelete);
app.get("/blog-edit/:id", blogEdit);
app.post("/blog-edit/:id", upload, blogUpdate);

async function home(req, res) {
  try {
    const query = `SELECT * FROM projects`;
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render("index", { project: result, user: req.session.user });
  } catch (error) {
    console.log(error);
    res.render("index");
  }
}

function registerPage(req, res) {
  res.render("register");
}

async function createNewUser(req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const query = `INSERT INTO users(name, email, password) VALUES(:name, :email, :password)`;
    const result = await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: { name, email, password: hashedPassword },
    });
    console.log("create new user success", result);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
}

function loginPage(req, res) {
  res.render("login");
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const query = `SELECT * FROM users WHERE email = :email`;
    const theUser = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { email },
    });
    if (!theUser.length) {
      req.flash("info", "Invalid user");
      return res.redirect("/login");
    }
    const isValidPassword = await bcrypt.compare(password, theUser[0].password);
    if (!isValidPassword) {
      req.flash("info", "Invalid password");
      return res.redirect("/login");
    }
    req.session.user = theUser[0];
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/login");
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    console.log("logout success");
    res.redirect("/");
  });
}

async function project(req, res) {
  try {
    const query = `SELECT * FROM projects`;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    res.render("project", { project: result });
  } catch (error) {
    console.log(error);
    res.render("project");
  }
}

async function projectDetail(req, res) {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM projects WHERE id = :id`;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
    console.log(result[0]);
    res.render("project-detail", { project: result[0] });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

async function projectPost(req, res) {
  const {
    name,
    start_date,
    end_date,
    description,
    nodeJS,
    nextJs,
    reactJs,
    typescript,
  } = req.body;
  let node_js;
  let next_js;
  let react_js;
  let typeScript;
  nodeJS ? (node_js = true) : (node_js = false);
  nextJs ? (next_js = true) : (next_js = false);
  reactJs ? (react_js = true) : (react_js = false);
  typescript ? (typeScript = true) : (typeScript = false);
  const image_url = `/uploads/${req.file.filename}`;
  try {
    const query = `INSERT INTO projects(name, start_date, end_date, description, node_js, next_js, react_js, typescript, image_url) VALUES(:name, :start_date, :end_date, :description, :node_js, :next_js, :react_js, :typescript, :image_url)`;
    await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: {
        name,
        start_date,
        end_date,
        description,
        node_js,
        next_js,
        react_js,
        typescript: typeScript,
        image_url,
      },
    });
    req.flash("success", "create new project success");
    console.log("create project success");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

async function projectDelete(req, res) {
  const { id } = req.params;
  try {
    const query = `DELETE FROM projects WHERE id = :id`;
    await sequelize.query(query, {
      type: QueryTypes.DELETE,
      replacements: { id },
    });
    console.log("delete success");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

async function projectEdit(req, res) {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM projects WHERE id = :id`;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
    res.render("project-edit", { project: result[0] });
  } catch (error) {
    console.log(error);
    res.redirect("/project");
  }
}

async function projectUpdate(req, res) {
  const { id } = req.params;
  const {
    name,
    start_date,
    end_date,
    description,
    nodeJs,
    nextJs,
    reactJs,
    typescript,
    oldImage,
  } = req.body;
  let node_js;
  let next_js;
  let react_js;
  let typeScript;
  nodeJs ? (node_js = true) : (node_js = false);
  nextJs ? (next_js = true) : (next_js = false);
  reactJs ? (react_js = true) : (react_js = false);
  typescript ? (typeScript = true) : (typeScript = false);
  let image;
  if (req.file) {
    console.log("file uploaded: ", req.file);
    image = `/uploads/${req.file.filename}`;
  } else {
    console.log("not uploaded");
    image = oldImage;
  }
  console.log("image: ", image);
  try {
    const query = `UPDATE projects SET name=:name, start_date=:start_date, end_date=:end_date, description=:description, node_js=:node_js, next_js=:next_js, react_js=:react_js, typescript=:typescript, image_url=:image WHERE id = :id`;
    await sequelize.query(query, {
      type: QueryTypes.UPDATE,
      replacements: {
        name,
        start_date,
        end_date,
        description,
        node_js,
        next_js,
        react_js,
        typescript,
        image,
        id,
      },
    });
    console.log(`update post id: ${id} success`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

async function blog(req, res) {
  try {
    const query = `SELECT * FROM blogs`;
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render("blog", { blog: result });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
}

async function blogPost(req, res) {
  const { title, content, author_id } = req.body;
  const author_id_num = parseInt(author_id);
  const image = `/uploads/${req.file.filename}`;
  try {
    const query = `INSERT INTO blogs(title, content, image, author_id) VALUES(:title, :content, :image, :author_id)`;
    const result = await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: { title, content, image, author_id: author_id_num },
    });
    console.log("create new post success", result[0]);
    res.redirect("/blog");
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
}

async function blogDetail(req, res) {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM blogs WHERE id = :id`;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
    res.render("blog-detail", { data: result[0] });
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
}

async function blogEdit(req, res) {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM blogs WHERE id = :id`;
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
    res.render("blog-edit", { data: result[0] });
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
}

async function blogUpdate(req, res) {
  const { id } = req.params;
  const { title, content, oldImage, author_id } = req.body;
  const author_id_num = parseInt(author_id);
  console.log(req.file);
  let image;
  if (req.file) {
    console.log("file uploaded: ", req.file);
    image = `/uploads/${req.file.filename}`;
  } else {
    console.log("not uploaded");
    image = oldImage;
  }
  console.log("image: ", image);
  try {
    const query = `UPDATE blogs SET title=:title, content=:content, image=:image, author_id=:author_id WHERE id = :id`;
    await sequelize.query(query, {
      type: QueryTypes.UPDATE,
      replacements: { title, content, image, author_id: author_id_num, id },
    });
    console.log(`update post id: ${id} success`);
    res.redirect("/blog");
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
}

async function blogDelete(req, res) {
  const { id } = req.params;
  try {
    const query = `DELETE FROM blogs WHERE id = :id`;
    await sequelize.query(query, {
      type: QueryTypes.DELETE,
      replacements: { id },
    });
    res.redirect("/blog");
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
}

function contact(req, res) {
  res.render("contact");
}

function testimonials(req, res) {
  res.render("testimonials");
}

function test(req, res) {
  const { id } = req.params;
  console.log(`params id: ${id}`);
  res.render("testing", { id: id ? `: ${id}` : null });
}

app.listen(port, () => console.log(`Running on port: ${port}`));
