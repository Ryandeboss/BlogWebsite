// Setting up middleware
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Get local modules
const days = require(__dirname + "/days.js");
const checkIfEmpty = days.checkIfEmpty;

// Connect to MongoDB
const { MongoClient } = require("mongodb");

const uri = "uri";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
}

startServer();
// Call the function to check if the database is empty and insert default items
checkIfEmpty(client);

home_MC =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. A eaque provident magnam aliquam. Laboriosam ad, qui consequatur nesciunt cumque explicabo, perspiciatis hic quibusdam aliquam molestiae neque. Tenetur cupiditate ad ratione.";

Contact_MC =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere nobis at quibusdam consectetur quasi! Ducimus enim nihil quae eum illum fugit quo itaque tenetur accusamus debitis, facilis obcaecati vitae amet laborum necessitatibus optio voluptas! Veniam assumenda maiores obcaecati nisi deserunt totam facere voluptate amet eligendi iusto repudiandae inventore quis quaerat, exercitationem optio quae. Est eius, ut explicabo expedita culpa, obcaecati fugiat saepe consectetur cumque odio officiis, unde sed facilis ab?";

About_MC =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id tempore blanditiis voluptates facere nostrum dolorum maiores, at nulla doloremque, nisi, ad minima labore in a illo voluptatem? Ullam eos quas iusto harum provident ut vero, officia esse incidunt tempore quam, animi laudantium delectus optio consectetur eligendi non molestias cumque veritatis.";

app.get("/", function (req, res) {
  try {
    days.getAll(client).then((allDays) => {
      allDays.forEach((element) => {
        app.get("/" + element.urlName, function (req, res) {
          res.render("blogMain", {
            Header: element.title,
            mainContent: element.text,
          });
        });
      });
    });
    days
      .getAll(client) // Fetch the data using days.getAll with the client object
      .then((allDays) => {
        res.render("blogMain", {
          Header: "Home",
          mainContent: home_MC,
          days: allDays,
        });
      })
      .catch((err) => {
        console.error("Error retrieving data from the database:", err);
        // Handle the error appropriately
        res.status(500).send("Internal Server Error");
      });
  } catch (err) {
    console.error("Error:", err);
    // Handle the error appropriately
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", function (req, res) {
  const buttonName = req.body.message;
  res.redirect("/" + buttonName);
});

app.get("/about", function (req, res) {
  res.render("blogMain", { Header: "About Us", mainContent: About_MC });
});

app.get("/contact", function (req, res) {
  res.render("blogMain", { Header: "Contact Us", mainContent: Contact_MC });
});

app.get("/compose", function (req, res) {
  res.render("blogMain", { Header: "Compose" });
});
app.post("/compose", function (req, res) {
  const title = req.body.title;
  const postContent = req.body.Post;
  days.AddDay(client, title, postContent);
  res.redirect("/");
});
