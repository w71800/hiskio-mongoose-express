const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Question = require("./models/data.js");
const methodOverride = require("method-override");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose
  .connect("mongodb://localhost:27017/testDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("success");
  })
  .catch(() => {
    console.log("failed.");
  });

app.listen(3000, () => {
  console.log("server is running on port 3000.");
});

app.get("/", (req, res) => {
  console.log("someone is request for /");
  res.render("homepage.ejs");
});
app.get("/questions/dashboard", (req, res) => {
  res.render("questionPost.ejs");
});

// 處理使用者向 /questions 頁面的 GET 請求
app.get("/questions", async (req, res) => {
  try {
    let data = await Question.find();
    res.render("questions.ejs", { data });
  } catch {
    res.send("There is some error happend when get the datas.");
  }
});

// 處理在 /post 頁面發出的 POST 請求
app.post("/questions/dashboard", (req, res) => {
  // 抽取 POST 請求的資料並生成一筆 MongoDB 資料（Through Mongoose）
  let { id, content, hardness } = req.body;
  let newQ = new Question({ id, content, hardness });

  newQ
    .save()
    .then(() => {
      console.log("Question accepted.");
      res.render("accept.ejs");
    })
    .catch(() => {
      console.log("Question denide");
      res.render("reject.ejs");
    });
});
// 請求單一資料的頁面
app.get("/questions/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Question.findOne({ id });

    if (data != null) {
      res.render("question.ejs", { data });
    } else {
      res.send("There's no data yor try to request.");
    }
  } catch {
    res.status(404);
    res.send("System Error!");
  }
});
// 請求編輯頁面
app.get("/questions/edit/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Question.findOne({ id });

    if (data != null) {
      res.render("edit.ejs", { data });
    } else {
      res.send("There's no data yor try to update.");
    }
  } catch {
    res.status(404);
    res.send("System Error!");
  }
});

app.put("/questions/edit/:id", async (req, res) => {
  let newData = req.body;
  let { id } = req.params;
  try {
    let data = await Question.findOneAndUpdate({ id }, newData, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/questions/${id}`);
  } catch {
    res.send("You cannot update the data because some reason.");
  }
});

// 處理刪除部分
app.get("/questions/delete/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Question.findOne({ id });
  try{
    if(data != null){
      res.render("delete.ejs", { data });
    }else{
      res.send("找不到該筆資料")
    }
  }catch{
    res.send("系統發生錯誤")
  }
});
app.delete("/questions/delete/:id", (req, res) => {
  let { id } = req.params;
  Question.deleteOne({ id })
    .then(() => {
      // res.send("成功刪除");
      res.redirect("/questions")
    })
    .catch((e) => {
      console.log(e);
      res.send("刪除失敗");
    });
});

app.get("/*", (req, res) => {
  res.status(404);
  res.send("Is not allowed.");
});
