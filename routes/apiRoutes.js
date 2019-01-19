var db = require("../models");
var unirest = require("unirest");
var mysql = require("mysql");

module.exports = function(app) {
  var ingredient;
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body)
      .then(function(dbExample) {
        res.json(dbExample);
      })
      .then(function() {
        var connection = mysql.createConnection({
          host: "localhost",
          port: 3306,
          user: "root",
          password: "",
          database: "exampledb"
        });
        connection.query("SELECT * FROM Examples", function(err, res) {
          ingredient = JSON.stringify(res[0].ingredientName);
          console.log("Ingredient for API: " + ingredient);
        });
      })
      .then(function(apiCall) {
        unirest
          .get(
            "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=6&offset=0&query=" +
              ingredient
          )
          .header(
            "X-RapidAPI-Key",
            "iO1JP0bW8vmshiir9bxd1hPu4sv4p1KhdBHjsnWR4JOwXs3gBt"
          )
          .end(function(result) {
            console.log("*****************RECIPE CALL*****************");
            for (i = 0; i < result.body.results.length; i++) {
              console.log("Recipe Name: " + result.body.results[i].title);

              db.Recipes.create({
                recipeName: result.body.results[i].title,
                photo: result.body.results[i].image,
                recipeNumber: result.body.results[i].id
              });
            }
          });
        // connection.end();
        res.json(apiCall);
      });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
