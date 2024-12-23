const getTimesBtn = document.getElementById("get-times-btn");
const dateInput = document.getElementById("date");
const longitudeInput = document.getElementById("longitude");
const latitudeInput = document.getElementById("latitude");
const outputDiv = document.getElementById("output");

// Function to format time
function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = sec % 60;
    minutes = minutes % 60;
    return `<div class="text-2xl text-gray-800 font-medium">${hours} <span class="text-gray-500">hours</span> ${minutes} <span class="text-gray-500">minutes</span> ${seconds} <span class="text-gray-500">seconds</span></div>`;
}




// Event listener for the get times button
getTimesBtn.addEventListener("click", async function () {
	const date = dateInput.value;
	const year = new Date().getFullYear();
	const longestDate = `${year}-06-20`;
	const shortestDate = `${year}-12-21`;
	const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitudeInput.value}&lng=${longitudeInput.value}&date=${date}&formatted=0`;
	const response = await fetch(apiUrl);
	const data = await response.json();
	const sunrise = new Date(data.results.sunrise).toLocaleString();
	const sunset = new Date(data.results.sunset).toLocaleString();
	const currentDayLength = data.results.day_length;
	// Get the day length of the longest day of the year
	const longestDayApiUrl = `https://api.sunrise-sunset.org/json?lat=${latitudeInput.value}&lng=${longitudeInput.value}&date=${longestDate}&formatted=0`;
	const longestDayResponse = await fetch(longestDayApiUrl);
	const longestDayData = await longestDayResponse.json();
	const longestDayLength = longestDayData.results.day_length;
	// Get the day length of the shortest day of the year
	const shortestDayApiUrl = `https://api.sunrise-sunset.org/json?lat=${latitudeInput.value}&lng=${longitudeInput.value}&date=${shortestDate}&formatted=0`;
	const shortestDayResponse = await fetch(shortestDayApiUrl);
	const shortestDayData = await shortestDayResponse.json();
	const shortestDayLength = shortestDayData.results.day_length;
	// Compare the current day length with the longest and shortest day length
	const currentDayDiffWithLongest = currentDayLength - longestDayLength;
	const currentDayDiffWithShortest = currentDayLength - shortestDayLength;
	// Display the results in the output div
	outputDiv.innerHTML = `Sunrise: ${sunrise}<br>Sunset: ${sunset}<br>
  Day length: ${formatTime(currentDayLength)}<br>`;
  if (currentDayDiffWithLongest > 0) {
    outputDiv.innerHTML += `Compared to longest day, this date is ${formatTime(currentDayDiffWithLongest)} longer<br>`
  } else {
    outputDiv.innerHTML += `Compared to longest day, this date is ${formatTime(-currentDayDiffWithLongest)} shorter<br>`
  }
  if (currentDayDiffWithShortest > 0) {
    outputDiv.innerHTML += `Compared to shortest day, this date is ${formatTime(currentDayDiffWithShortest)} longer`
  } else {
    outputDiv.innerHTML += `Compared to shortest day, this date is ${formatTime(-currentDayDiffWithShortest)} shorter`
  }

});

function getUserLatLng() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitudeInput.value = position.coords.latitude;
      longitudeInput.value = position.coords.longitude;
    });
  } else {
    console.log("Geolocation is not available in your browser.");
  }
}

function init() {
  const currentDate = new Date().toISOString().substr(0, 10);
  dateInput.value = currentDate;
  getUserLatLng();
}

window.onload = init;
