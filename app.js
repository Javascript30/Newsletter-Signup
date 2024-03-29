/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const year = new Date().getFullYear();

app.get("/", function(req, res) {
  res.render("signup", { year: year });
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/e1b2c738d3";

  const options = {
    method: "POST",
    auth: `1eskim:${process.env.keymailchimp}`,
  };

  const request = https.request(url, options, function(response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.render("success");
    } else {
      res.render("failure");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  // request.write('<head><meta charset="utf-8"></head>');
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

// API Key
// 2783a77d9eb34a9c7bb26f4b6c

// List Id
// e1b2c738d3
