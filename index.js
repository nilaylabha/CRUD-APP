const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const TodoTask = require("./model/TodoTask");
const port = 5000;
const app = express();

// app.use(express.static(__dirname + '/public'));
app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to database
mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to database");

  app.listen(port, () => {
    console.log(`Server is runing on ${port}`);
  });
});

//view engin configuration
app.set("view engine", "ejs");

//get method
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

//post method
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//update method
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

  app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });

//post method
// app.post('/',async(req,res)=>{
//     // const todoTask = new TodoTask()
//     const {content} = req.body
//         try {
//             // const todoUser = new todotask({content})
//             // todoUser.save();
//         await todotask.create({content:content})
//         // console.log(todotask)
//         res.redirect("/");
//         } catch (err) {
//         res.redirect("/");
//         }
// })
