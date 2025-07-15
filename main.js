// create std input and output
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}
// find coordinates
async function getCoords(zipcode) {
  try {
    let url = `http://api.zippopotam.us/us/${zip}`;
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: #{response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error Fetching location:", error.message);
  }
}
// connect to api
// grab data from api
// format data
// menu
function mainMenu() {
  console.log("Welcome to Weather Fetcher");
  console.log("1. Display weather by Zipcode\n2. Exit");
  let menuChoice = ask("Please choose a menu item ");
  if (NmenuChoice == "1") {
    let zipcode = ask("Please type your zip code (5 digit) ");
    getCoords(zipcode);
  } else {
    console.log("Invalid choice please try again");
  }
}
mainMenu();
