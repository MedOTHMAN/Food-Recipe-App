import { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import {Header,AppNameComponent,AppIcon,SearchComponent,SearchIcon,SearchInput } from "./components/headerComponent";
import {RecipeListContainer,RecipeContainer,CoverImage,RecipeName,IngredientsText,SeeMoreText } from "./components/recipeComponent";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import React from "react";


const APP_ID = "f429e466";
const APP_KEY = "204f48ccc5874fbb6078e3470c2069a5";

const Container = styled.div`
display: flex;
flex-direction: column;
`;
const Placeholder = styled.img`
width: 120px;
height: 120px;
margin:200px;
opacity: 50%;
`;

const RecipeComponent = (props) => {
  console.log(props);
  const {recipeObj} = props;
  const [show, setShow] = React.useState(false);
  const handleClose = () => {
    setShow(false);
  };

  return(
    <>
    <Dialog open={show} onClose={handleClose}>
    <DialogTitle id="alert-dialog-slide-title">Ingredient</DialogTitle>
    <DialogContent>
      <table>
        <thead>
          <th>Ingredients</th>
          <th>Weight</th>
        </thead>
        <tbody>
          {recipeObj.ingredients.map((ingredientObj)=> (
          <tr>
            <td>{ingredientObj.text}</td>
            <td>{ingredientObj.weight}</td>
          </tr>

          ))}
        </tbody>
      </table>
    </DialogContent>
    <DialogActions>
          <IngredientsText onClick={() => window.open(recipeObj.url)}>See More</IngredientsText>
          <SeeMoreText onClick={()=> setShow(false)}>Close</SeeMoreText>
        </DialogActions>
     </Dialog>
    <RecipeContainer>
            <CoverImage src={recipeObj.image} />
            <RecipeName>{recipeObj.label}</RecipeName>
            <IngredientsText onClick={() => setShow(true)}>ingredients</IngredientsText>
            <SeeMoreText onClick={() => window.open(recipeObj.url)}>See Complete Recipe</SeeMoreText>
          </RecipeContainer>
          </>
  )
}

function App() {

  const [timeoutId, updateTimeoutId] = useState();
  const [recipeList, updateRecipeList] = useState([]);

  const fetchRecipe = async (searchString) =>{
    const response = await Axios.get(`https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    updateRecipeList(response.data.hits);
  };

  const onTextChange= (event) => {
    clearTimeout(timeoutId);
    const timeout= setTimeout(()=> fetchRecipe(event.target.value),500);
    updateTimeoutId(timeout)
  }
  return (
    <Container>
      <Header>
        <AppNameComponent><AppIcon src="/hamburger.svg" />Recipe Finder</AppNameComponent>
        <SearchComponent>
          <SearchIcon src="/search-icon.svg" />
          <SearchInput placeholder="Search Recipe" onChange={onTextChange} />
        </SearchComponent>
        </Header>
        <RecipeListContainer>
          {recipeList.length===0 ? <Placeholder src="/hamburger.svg" /> :  recipeList.length && recipeList.map((recipeObj) => (
            <RecipeComponent recipeObj={recipeObj.recipe} />
          ))}
        </RecipeListContainer>
    </Container>
  );
}

export default App;
