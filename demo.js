const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/DEMO/recipes';

const state = {
  recipes: []
  // could add other pieces of state
} 

const recipesList = document.querySelector('#recipes');

const addRecipeForm = document.querySelector('#addRecipe');
addRecipeForm.addEventListener('submit', createRecipe);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getRecipes()
  renderRecipes()
}
render();

/**
 * Update state with recipes from API
 */
async function getRecipes() {
  try {
    // fetch recipe data
    const response = await fetch(API_URL)
    // parse response - translate JSON into a JS object
    const json = await response.json()
    // update `recipes` array
    state.recipes = json.data
    console.log(state.recipes)
  } catch(error) {
    console.error(error)
  }
}

/**
 * Ask API to create a new recipe and rerender
 * @param {Event} event
 */
async function createRecipe(event) {
    event.preventDefault()

    const name = addRecipeForm.title.value
    const imageUrl = addRecipeForm.imageUrl.value
    const description = addRecipeForm.instructions.value

    try {
      // post recipe data
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, imageUrl, description})
      })
      // parse response
      const json = await response.json()
      // rerender the page (which will update `recipes` array)
      render()

    } catch(error) {
      console.error(error)
    }
}

/**
 * Ask API to update an existing recipe and rerender
 * NOTE: This is not currently used in the app, but it's here for reference.
 * @param {number} id id of the recipe to update
 * @param {string} name new name of recipe
 * @param {string} imageUrl new url of recipe image
 * @param {string} description new description for recipe
 */
async function updateRecipe(id, name, imageUrl, description) {
  // STRETCH GOAL - add the HTML to provide the user a form where they can edit an existing recipe AND send a PUT request to the API to make those updates
}

/**
 * Ask API to delete a recipe and rerender
 * @param {number} id id of recipe to delete
 */
async function deleteRecipe(id) {
  try {
    // make a DELETE request
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
    // we can parse response and do things with response if needed
    // rerender everything
    render()
  } catch(error) {
    console.error(error)
  }
}

/**
 * Render recipes from state
 */
function renderRecipes() {
  if(state.recipes.length < 1) {
    const newListItem = document.createElement("li")
    newListItem.textContent = "No recipes found"
    recipesList.append(newListItem)
  }
  else {
    recipesList.replaceChildren()  // -> should empty the recipesList element
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren

    // for each recipe object
    state.recipes.forEach((recipeObj) => {
      // create a <li> 
      const newListItem = document.createElement("li")
      newListItem.classList.add("recipe")

      // with a heading, image, paragraph
      const newHeading = document.createElement("h2")
      newHeading.textContent = recipeObj.name
      const newImage = document.createElement("img")
      newImage.src = recipeObj.imageUrl
      const newParagraph = document.createElement("p")
      newParagraph.textContent = recipeObj.description

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.addEventListener("click", () => deleteRecipe(recipeObj.id))

      newListItem.append(newHeading, newImage, newParagraph, deleteButton)
      // append to `recipesList`
      recipesList.append(newListItem) 
    })
  }
}