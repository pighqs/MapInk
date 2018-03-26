// Express
const express = require("express");
const app = express();
//Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

//  BodyParser
const bodyParser = require("body-parser");

// Formidable (parsing the body of a multipart/form-data)
const formidable = require("express-formidable");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(formidable());

// ejs & public
app.set("view engine", "ejs");
app.use(express.static("public"));

// Session
const session = require("express-session");
app.use(
  session({
    secret: "a4f8071f-c873-4447-8ee2",
    resave: false,
    saveUninitialized: false
  })
);

// Bcrypt
const bcrypt = require("bcrypt");

//  Connection MLAB
const mongoose = require("mongoose");
const options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };

mongoose.connect(
  "mongodb://pighqs:mapINK1974@ds243418.mlab.com:43418/mapink",
  { useMongoClient: true },
  function(err) {
    if (err) {
      console.log("erreur : " + err);
    } else {
      console.log("bien connecté à DB Mlab mapInk");
    }
  }
);

// schemas
const tattooArtistSchema = mongoose.Schema({
  mail: String,
  password: String,
  name: String,
  website: String
});

const sessionSchema = mongoose.Schema({
  artistID: String,
  tattooShop: String,
  shopAddress: String,
  shopCoords: {
    lat: String,
    lng: String
  },
  startDate: Date,
  endDate: Date
});

// models
const ArtistModel = mongoose.model("artists", tattooArtistSchema);
const sessionModel = mongoose.model("sessions", sessionSchema);

///////////////    ROUTES     /////////////

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/searchresults", function(req, res) {
  res.render("index");
});

app.get("/savesession", function(req, res) {
  res.render("index"), { isUserLog: undefined };
});

app.get("/registerlogin", function(req, res) {
  res.render("index");
});

app.get("/register", function(req, res) {
  res.render("index"), { isUserLog: undefined };
});

app.post("/register", function(req, res) {
  //ArtistModel.findOne({ mail: req.fields.mail }, function(err, mailFound) {
  ArtistModel.findOne(
    {
      $or: [{ mail: req.fields.mail }, { name: req.fields.artistName }]
    },
    function(err, mailFound) {
      if (err) {
        console.log("erreur find mongoDB", err);
        res.json({ testRegister: false, errRegister: err });
      } else if (!mailFound) {
        bcrypt.hash(req.fields.password, 10).then(function(hashedPassword) {
          let tattooArtist = new ArtistModel({
            mail: req.fields.mail,
            password: hashedPassword,
            name: req.fields.artistName,
            website: req.fields.website
          });
          tattooArtist.save((error, artist) => {
            if (error) {
              console.log("erreur enregistrement user", err);
              res.json({ testRegister: false, errRegister: err });
            } else {
              req.session.artistID = artist._id;
              req.session.artistName = artist.name;

              res.json({
                testRegister: req.session.artistID,
                artistName: req.session.artistName,
                errRegister: false
              });
            }
          });
        });
      } else {
        res.json({
          testRegister: false,
          errRegister: "this mail or name is already take"
        });
      }
    }
  );
});

app.get("/login", function(req, res) {
  res.render("index", { isUserLog: undefined });
});

app.post("/login", function(req, res) {
  var query = ArtistModel.findOne({ mail: req.fields.mail });
  query.exec(function(error, artist) {
    if (artist) {
      bcrypt
        .compare(req.fields.password, artist.password)
        .then(function(passwordsMatch) {
          if (passwordsMatch) {
            req.session.artistID = artist._id;
            req.session.artistName = artist.name;
            res.json({
              testLogin: req.session.artistID,
              artistName: req.session.artistName,
              errLogin: false
            });
          } else {
            console.log("login failed, password error");
            res.json({
              testLogin: false,
              errLogin: "login failed, password error"
            });
          }
        })
        .catch(function(error) {
          console.log("login failed:", error);
          res.json({ testLogin: false, errLogin: error });
        });
    } else {
      res.json({ testLogin: false, errLogin: "login failed, mail unknown" });
    }
  });
});

app.get("/logout", function(req, res) {
  testLogin = false;
  res.json(testLogin);
});


app.get("/mysessions", function(req, res) {
  res.render("index"), { isUserLog: true };
});

app.post("/mysessions", function(req, res, next) {
  let sessionsList = []; 
  const query = sessionModel.find({ artistID: req.fields.artistID });
  query.exec(function(error, sessions) {
    if (sessions) {
          res.json({sessionsList: sessions})
          } else {
            res.json({
              sessionsList: false,
            });
          }
        })
        .catch(function(error) {
          console.log("mysession failed:", error);
          res.json({ sessionsList: error });
        });
});

app.get("/addguestsession", function(req, res) {
  res.render("index"), { isUserLog: true };
});

app.post("/addguestsession", function(req, res) {
  let newSession = new sessionModel({
    artistID: req.fields.artistID,
    tattooShop: req.fields.tattooShop,
    shopAddress: req.fields.shopAddress,
    shopCoords: {
      lat: req.fields.shopLat,
      lng: req.fields.shopLng
    },
    startDate: req.fields.startDate,
    endDate: req.fields.endDate
  });
  newSession.save((error, sessionSaved) => {
    if (error) {
      console.log("erreur enregistrement session", err);
      res.json({ sessionSaved: false, errSession: err });
    } else {
      res.json({
        sessionSaved: sessionSaved,
        errSession: false
      });
    }
  });
});

app.delete("/deleteguestsession/:id/:artistID", function(req,res){
  console.log(req.session.artistID )
 const query = sessionModel.remove({ _id: req.params.id })
 query.exec(function(error, sessionDeleted) {
  if (sessionDeleted) {
    const query = sessionModel.find({ artistID: req.params.artistID  });
    query.exec(function(error, sessionsAfterDelete) {
      if (sessionsAfterDelete) {
            res.json({sessionsList: sessionsAfterDelete})
            } else {
              res.json({
                sessionsList: false,
              });
            }
          })
          .catch(function(error) {
            console.log("mysession failed:", error);
            res.json({ sessionsList: error });
          });
        } else {
          res.json({
            sessionsList: false,
          });
        }
      })
      .catch(function(error) {
        console.log("delete session failed:", error);
        res.json({ sessionsDeleted: error });
      });
});

