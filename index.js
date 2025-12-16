import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Function to create a single commit for a specific week and day in a specific year
const markCommit = (year, x, y) => {
  const date = moment()
    .year(year) // Set the target year dynamically
    .startOf("year")
    .add(x, "w") // Add weeks to the year's start
    .add(y, "d") // Add days to the week's start
    .format();

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

// Function to create multiple commits for a specific year
const makeCommits = (year, n) => {
  if (n === 0) return simpleGit().push();
  const x = random.int(0, 52); // Weeks in a year
  const y = random.int(0, 6); // Days in a week
  const date = moment()
    .year(year)
    .startOf("year")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(date, { "--date": date }, makeCommits.bind(this, year, --n)); // Recursively create commits
  });
};

// Create commits for both 2024 and 2025
const totalCommits = 200; // Total number of commits across both years
const commitsFor2024 = Math.floor(totalCommits / 2); // Half for 2024
const commitsFor2025 = totalCommits - commitsFor2024; // Remaining for 2025

makeCommits(2024, commitsFor2024); // Generate commits for 2024
makeCommits(2025, commitsFor2025); // Generate commits for 2025