const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events'

const state = {
  parties: []
} 

const partiesList = document.querySelector('#parties');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', createParty)

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties()
  renderParties()
}
render();

/**
 * Update state with recipes from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL)
    const json = await response.json()
    state.parties = json.data
    console.log(state.parties)
  } catch(error) {
    console.error(error)
  }
}


/**
 * Ask API to create a new party and rerender
 * @param {Event} event
 */

async function createParty(event) {
  event.preventDefault()
  const name = addPartyForm.title.value
  const dateTime = addPartyForm.dateTime.value
  const location = addPartyForm.location.value
  const description = addPartyForm.description.value

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name,
        dateTime,
        location,
        description,
        date: dateTime,
      }),
    });

    // console.log('Response Status:', response.status);
    // console.log('Response Text:', await response.text());

    // if (!response.ok) {
    //   throw new Error('Network response was not okay');
    // }

    const json = await response.json();
    render();

  } catch(error) {
    console.error(error);
  }
}

/**
 * Ask API to delete a party and rerender
 * @param {number} id id of recipe to delete
 */

/**
 * Render parties from state
 */
async function renderParties() {
  if(state.parties.length <1) {
    const newListItem = document.createElement("li")
    newListItem.textContent = "No parties found"
    partiesList.append(newListItem)
  }
  else {
    partiesList.replaceChildren()
    state.parties.forEach((partyObj) => {
      const newListItem = document.createElement("li")
      newListItem.classList.add("party")

      //with heading, date-time, paragraph, paragraph
      const newHeading = document.createElement("h2")
      newHeading.textContent = partyObj.name

      const newDateTime = document.createElement("p")
      newDateTime.textContent = "Date and Time: " + partyObj.dateTime

      const newLocation = document.createElement("p")
      newLocation.textContent = partyObj.location

      const newDescription = document.createElement("p")
      newDescription.textContent = partyObj.description

      newListItem.append(newHeading, newDateTime, newLocation, newDescription)
      partiesList.append(newListItem)
  
    })
  }
}