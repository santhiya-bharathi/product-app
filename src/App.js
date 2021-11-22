
import './App.css';
import { Switch, Route, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useEffect, useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



// this app is developed by using api and useEffect 
export default function App() {

const [scientist, setScientist] = useState([]);
  const history = useHistory();
  const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  palette: {
    mode: mode,
  },
});
console.log(scientist);

useEffect(()=>{
  fetch("https://616d58f537f997001745d9d1.mockapi.io/products", {method:"GET"})
  .then((data)=>data.json())
  .then((scis)=>setScientist(scis));
}, []);

  return (
     // themeprovider for dark and light mode

      // paper for blackground
      <ThemeProvider theme={darkTheme}>
      <Paper elevation={4} style={{borderRadius:"0px",minHeight:"100vh"}}>

    <div className="App">
       <AppBar position="static">
       <Toolbar>
       <Button varient="text" color="inherit" onClick={()=>history.push("/")}>Home</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/createscientist")}>Create scientistlist</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/scientistlist")}>Scientist list</Button>

       <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
       </Toolbar>
       </AppBar>
      
       <Switch>
      
      <Route exact path="/">
          <Home />
        </Route>

        <Route path="/scientistlist/edit/:id">
          <Editscientist />
        </Route>

        <Route path="/scientistlist">
          <Scientistlist />
        </Route>

        <Route path="/createscientist">
          <Createscientist />
        </Route>

        <Route path="**">
          <NotFound/>
        </Route>

      </Switch>
    </div>
    </Paper>
    </ThemeProvider>
  );
}


//creating home page
function Home() {
  const history = useHistory();
  return (
    <div className="home">
      <h2 className="home-hello">Hello All!!!</h2>
      <img src="https://cloudproserv.com/wp-content/uploads/2019/05/Welcome-to-our-new-website-1280x720.jpg" alt="welcome"/>
      <div>
      <Button onClick={()=>history.push("/scientistlist") }variant="contained">scientistlist<ArrowForwardIcon/></Button>
      </div>
    </div>
  );
}

//creating not found page
function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  src="https://s12emagst.akamaized.net/assets/hu/images/error_404_600px.gif" alt="404 not found"/>
    </div>
  );
}

//crud app is developed by using POST method using API

function Createscientist(){
  const history = useHistory();
  const [name, setName] = useState("");
  const [productpic, setProductpic] = useState("");

const addUser =()=>{
  const newUser= {productpic, name};
 
  fetch(`https://616d58f537f997001745d9d1.mockapi.io/products`, {
    method:"POST",
    body: JSON.stringify(newUser),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/scientistlist"));
};

  return(
    <div className="create-list-place">
      <TextField value={productpic} 
      onChange={(event)=>setProductpic(event.target.value)}  label="enter profile url" variant="filled" />
     
     <TextField value={name}
      onChange={(event)=>setName(event.target.value)} label="enter name" variant="filled" />

      <Button onClick={addUser} variant="contained">Create</Button>
    </div>
  
  );
}

// edit is developed by using GET and PUT method using API

function Editscientist(){
  
  const {id} = useParams();
  const [scientistdet, setScientistdet] = useState(null);
useEffect(()=>{
  fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setScientistdet(mv));
}, [id]);
//only show update movie when data is available
  return scientistdet? <Updatescientist scientistdet={scientistdet}/>:"";
  
}


function Updatescientist({scientistdet}){
  const [name, setName] = useState(scientistdet.name);
  const [productpic, setProductpic] = useState(scientistdet.productpic);
  const history = useHistory();
  const editUser =()=>{
    
    const updatedUser= {productpic, name};//shorthand
    console.log(updatedUser);

    fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${scientistdet.id}`, {
    method:"PUT",
    body: JSON.stringify(updatedUser),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/scientistlist"))
  };
  return(
    <div className="create-list-place">
    <TextField value={productpic} 
    onChange={(event)=>setProductpic(event.target.value)}  label="enter pic url" variant="filled" />
   
   <TextField value={name}
    onChange={(event)=>setName(event.target.value)} label="enter scientist name" variant="filled" />

    <Button onClick={editUser} variant="contained">Save</Button>
  </div>
  );
}

  
// userlist developed by using GET method and DELETE method is used for delete list using API

function Scientistlist(){

  const [scientist, setScientist] = useState([]);
  // console.log(scientist);
  const getScientist = () =>{
      fetch("https://616d58f537f997001745d9d1.mockapi.io/products")
      .then((data)=>data.json())
      .then((scis)=>setScientist(scis));
  };
  useEffect(getScientist, []);

  //after delete and refresh
  const deleteScientist = (id) =>{
    fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${id}`, {method:"DELETE"})
    .then(()=>getScientist());
  };

  const history = useHistory();
  return(
    <section>
      {scientist.map(({productpic,name,id})=>(<Listscientist productpic={productpic} name={name}
      id={id}
      deleteButton= {<IconButton 
        onClick={()=> deleteScientist(id)}
        aria-label="delete" color="error"
      >
      <DeleteIcon />
    </IconButton>}
      editButton= {<IconButton 
        aria-label="edit"  color="success"
       onClick={()=>history.push("/scientistlist/edit/" + id)}>
       <EditIcon />
     </IconButton>}
      />))}
    </section>
  );
}

function Listscientist({productpic,name,editButton,deleteButton}){
  return(
  <div className="content-div">
    <div>
  <img className="hero-img" src={productpic} alt="profile"/>
  <div className="content-div-name">
  <h2>{name}</h2>

  <div className="edit-delete">
    {editButton}{deleteButton}
    </div>
  
  </div>
 <hr></hr>
  </div>
  </div>
  );
}










// const products = [{id:"50", productpic:"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone11-red-select-2019?wid=940&hei=1112&fmt=png-alpha&.v=1566956144763", name:"Apple iPhone 11",prize:"₹47,900.00"},
// {id:"51", productpic:"https://i1.wp.com/www.alphr.com/wp-content/uploads/2020/02/How-to-Add-Airpods-on-Find-my-phone-iphone.jpg?fit=1000%2C666&ssl=1", name:"airpods iphone",prize:"₹12,900"},
// {id:"52", productpic:"https://m.media-amazon.com/images/I/41gJrkMJqfL.jpg", name:"iphone watch",prize:"₹45,999"},
// {id:"53", productpic:"https://i.pinimg.com/736x/ba/59/4f/ba594f067c778474ef1e251a28206a79.jpg", name:"women running shoes",prize:"₹2500"},
// {id:"54", productpic:"https://img.joomcdn.net/227c84171c2e3c0fd75f21baab71a0b8a1054396_original.jpeg", name:"sunglasses",prize:"₹816.61"},
// {id:"55", productpic:"https://media.cntraveler.com/photos/60738c35ac52332b71f172c1/master/w_2100,h_1500,c_limit/MensSlipOnShoes-2021-LoroPiana.jpg", name:"MensSlipOnShoes",prize:"₹8000"},
// {id:"56", productpic:"https://i.pinimg.com/originals/7d/5c/02/7d5c02a7a3be79428b7de5a4d878303b.jpg", name:"women's watch",prize:"₹3000"},
// {id:"57", productpic:"https://assetscdn1.paytm.com/images/catalog/product/A/AP/APPEYEBOGLER-COSEVE88413F32E363/1601890054864_0..jpg", name:"T shirt",prize:"₹500"},
// {id:"58", productpic:"https://assets.ajio.com/medias/sys_master/root/20210316/y9wC/604fbab37cdb8c1f14635182/-473Wx593H-441114367-red-MODEL.jpg", name:"Girls T shirt",prize:"₹400"},
// {id:"59", productpic:"https://cdn.shopify.com/s/files/1/0266/6276/4597/products/100001_300863512_044_1.jpg?v=1627733353", name:"Girls T shirt",prize:"₹450"},
// {id:"60", productpic:"https://lh3.googleusercontent.com/proxy/TA7dVCj60CeeO0OnPYcpMXRJ-4lI-pD23Xi62LBxYOSzeyiy8iQbwMGPwGn0SJmRJWKe1v1S6zeEv1eE5LoOPZGCvdA7iOEz7VSQ2nIf4pGS7NxCoAYsUveM15C7elOs10FldThRk33q799xNg", name:"T-shirt with pants",prize:"₹1500"},
// {id:"61", productpic:"https://i.pinimg.com/736x/00/82/23/0082238e63928384b6a58b56aa4d301c.jpg", name:"casual blazer for boys",prize:"₹5000"},
// {id:"62", productpic:"https://i.pinimg.com/736x/49/c9/54/49c954153c8a887614fe6de6c1a635e4.jpg", name:"barbie gown",prize:"₹45,999"},
// {id:"63", productpic:"https://i.pinimg.com/550x/ae/cf/a5/aecfa5271bc9a60054d2fa11783440ff.jpg", name:"long gown",prize:"₹15,000"},
// {id:"64", productpic:"https://i.pinimg.com/originals/14/2e/06/142e067adf6d1daed641ac1405a68dbe.jpg", name:"sherwani",prize:"₹45,000"}]

