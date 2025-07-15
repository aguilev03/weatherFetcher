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
    let url = `http://api.zippopotam.us/us/${zipcode}`;
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    if (data && Object.keys(data).length === 0) {
      console.log("Invalid Zip code, please try again");
      await ask("Press Enter to continue");
      return false;
    } else {
      const lon = data.places[0].longitude;
      const lat = data.places[0].latitude;
      const city = data.places[0]["place name"];
      const state = data.places[0].state;
      return { lat, lon, city, state };
    }
  } catch (error) {
    console.error("Error Fetching location:", error.message);
  }
}

// grab data from api
async function weatherFetch(coords) {
  try {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m&timezone=America/Chicago&temperature_unit=fahrenheit`;

    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Fetching location:", error.message);
  }
}

// menu
async function mainMenu() {
  let exit = false;

  while (!exit) {
    console.clear();
    console.log("Welcome to Weather Fetcher");
    console.log("1. Display weather by Zipcode\n2. Exit");
    let menuChoice = await ask("Please choose a menu item ");
    if (menuChoice == "1") {
      let zipcode = await ask("Please type your zip code (5 digit) ");
      //console.log(zipcode);
      let coords = await getCoords(zipcode);
      // console.log(coords);
      if (!coords) {
        console.log("Invalid Zip code, please try again");
        await ask("Press Enter to continue");
      } else {
        let currWeath = await weatherFetch(coords);
        // console.log(currWeath);
        console.clear();
        console.log(
          `Current weather in ${coords.city}, ${coords.state} is ${currWeath.current.temperature_2m} ${currWeath.current_units.temperature_2m}`
        );
        console.log("Exiting...");
        exit = true;
      }
    } else {
      console.log("Invalid choice please try again");
      await ask("press Enter to continue ...");
    }
  }
  rl.close();
  process.exit();
}

mainMenu();
