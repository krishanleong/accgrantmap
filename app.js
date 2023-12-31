if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Business = require("./models/business");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
// const dbURL = "mongodb://127.0.0.1:27017/accgrantmap";

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, {});

app.post("/showLocal", async (req, res) => {
  console.log("In show city route", req.params);
  let { city } = req.body;

  //uppercase first word in city
  city = city.charAt(0).toUpperCase() + city.slice(1);
  console.log(city);
  const allBusiness = await Business.find({ city });
  finalSorter(allBusiness);
  console.log(allBusiness);
  //console.log ("result of Mongo Search", allBusiness);
  res.render("showLocal", { allBusiness });
});

app.get("/showLocal/:id", async (req, res) => {
  const { id } = req.params;
  const business = await Business.findById(id);
  console.log(business);
  res.render("showTutor", { business });
});

app.get("/showLocal", async (req, res) => {
  console.log(req.body);
  const allBusiness = await Business.find({ city: "Charlottesville" });

  //console.log ("result of Mongo Search", allBusiness);
  res.render("showLocal", { allBusiness });
});
const sorterOfNullValues = (a, b) => {
  return assignValueOfNullAtEnd(a.website).localeCompare(
    assignValueOfNullAtEnd(b.website)
  );
};

const assignValueOfNullAtEnd = (val) => {
  if (val === null) {
    return "ZZZZZZZZZZZZZZZZ";
  } else {
    return val;
  }
};

function finalSorter(arr) {
  return arr.sort(sorterOfNullValues);
}
app.get("/search", (req, res) => {
  res.render("search");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/showTutor", async (req, res) => {
  res.render("showTutor");
});

app.get("/map", async (req, res) => {
  const allBusiness = await Business.find({});
  res.render("map", { allBusiness });
});

app.get("/*", async (req, res) => {
  res.render("search");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
