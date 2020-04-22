var express = require("express");
var router = express.Router();
const request = require("request");

const apiKey = "<YOUR API KEY: NEED to purchase>";
const apiBaseUrl = "http://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

/* set Global */
router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get("/", function(req, res, next) {
  request.get(nowPlayingUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);

    res.render("index", { parsedData: parsedData.results });
  });
});

/* single-movie */
router.get("/movie/:id", (req, res, next) => {
  const movieId = req.params.id;
  const thisMovieapiUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  request.get(thisMovieapiUrl, (error, response, movieData) => {
    if (error) {
      res.send("Error occured!!!");
    }
    const parsedData = JSON.parse(movieData);
    res.render("single-movie", {
      parsedData
    });
  });
});

/* search */
router.post("/search", (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  if (cat != "" || userSearchTerm != "") {
    const movieapiUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
    // res.send(movieapiUrl);

    request.get(movieapiUrl, (error, resposne, movieData) => {
      if (error) {
        res.send("Error occured!!!");
      }

      var parsedData = JSON.parse(movieData);
      //   res.json(parsedData);
      if (cat === "person" && parsedData.results.length !== 0) {
        parsedData.results = parsedData.results[0].known_for;
      }
      if (parsedData.results.length !== 0) {
        res.render("index", { parsedData: parsedData.results });
      } else {
        res.send("NO Data Found!!");
      }
    });
  } else {
    res.send("Please enter something!");
  }
});
module.exports = router;
