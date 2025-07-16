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

const fs = require("fs");
const path = require("path");

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

function celsiusConv(temp) {
  return (temp - 32) / (9 / 5);
}

// save to json file
function writeJson(wdata) {
  //let now = new Date();
  //let timestamp = now.toISOString().replace(/[:]/g, "-").replace(/\..+/, "");

  let filename = `saveZip_.json`;

  fs.writeFile(filename, JSON.stringify(wdata, null, 2), (err) => {
    if (err) {
      console.error("Error saving file:", err);
    } else {
      //console.log(`file saved as ${filename}`);
    }
  });
}

// load json files
let allZips = [];

function readSaves() {
  return new Promise((resolve, reject) => {
    fs.readdir(".", (err, files) => {
      if (err) {
        return console.error("Failed to read directory:", err);
      }

      let jsonFiles = files.filter(
        (file) => file.startsWith("saveZip_") && file.endsWith(".json")
      );
      let combineZips = [];
      jsonFiles.forEach((file) => {
        try {
          let data = fs.readFileSync(file, "utf8");
          let zips = JSON.parse(data);

          // merge zip codes into master array
          combineZips.push(...zips);
        } catch (err) {
          console.error(`Error reading/parsing ${file}:`, err);
        }
      });
      resolve(combineZips);
      //console.log("Loaded Zip codes");
    });
  });
}
/* Main menu loop */

async function mainMenu() {
  let allZips = [];
  let exit = false;
  // main loop

  while (!exit) {
    allZips = await readSaves();
    console.clear();
    console.log("Welcome to Weather Fetcher");

    /* display Menu */
    console.log("*** Previous Zips ***");

    // List zip codes used previously
    for (let i = 0; i < allZips.length; i++) {
      console.log(`${i + 1}. ${allZips[i]}\t`);
    }

    /* display Menu */
    console.log("\n1. Display weather by Zipcode\n2. Exit\n");

    // Menu Commands
    let menuChoice = await ask("Please choose a menu item ");

    // search by Zip code branch
    if (menuChoice == "1") {
      let zipcode = await ask("Please type your zip code (5 digit) ");
      //console.log(zipcode);
      let coords = await getCoords(zipcode);
      // console.log(coords);

      // if theres no data in coords have user try again if not continue
      if (!coords) {
        console.log("Invalid Zip code, please try again");
        await ask("Press Enter to continue");
      } else {
        let currWeath = await weatherFetch(coords);
        // console.log(currWeath);
        console.clear();

        let temp = currWeath.current.temperature_2m;
        let tempDisp = currWeath.current_units.temperature_2m;
        formatTemp = await ask("Celsius or Farenheit (C/F)  ");
        if (formatTemp.toLowerCase() === "c") {
          ftemp = temp = celsiusConv(
            parseFloat(currWeath.current.temperature_2m)
          );
          tempDisp = "°C";
        }
        //display current weather for zip code
        console.log(
          `Current weather in ${coords.city}, ${coords.state} is ${temp.toFixed(
            1
          )} ${tempDisp}`
        );
        allZips.push(zipcode);
        await writeJson(allZips);

        // ask to continue and save zip for history or quit the program
        let startOver = await ask("Would you like to check again? Y/n ");
        if (
          startOver.toLowerCase() === "n" ||
          startOver.toLowerCase() === "no"
        ) {
          console.log("Exiting...");
          exit = true;
        } else {
        }
      }
    } else if (menuChoice === "2") {
      console.log("Exiting...");
      exit = true;
    } else {
      console.log("Invalid choice please try again");
      await ask("press Enter to continue ...");
    }
  }
  rl.close();
  process.exit();
}

mainMenu();
