
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


// this app is developed by using api and useEffect and formik validation added
export default function App() {

const [product, setProduct] = useState([]);
const history = useHistory();
const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  palette: {
    mode: mode,
  },
});
console.log(product);
// GET method is used for read the data
useEffect(()=>{
  fetch("https://616d58f537f997001745d9d1.mockapi.io/products", {method:"GET"})
  .then((data)=>data.json())
  .then((scis)=>setProduct(scis));
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
                <Button varient="text" color="inherit" onClick={()=>history.push("/createproduct")}>Add Product</Button>
                <Button varient="text" color="inherit" onClick={()=>history.push("/productlist")}>Product list</Button>
                

                <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
              </Toolbar>
            </AppBar>
      
            <Switch>
      
                <Route exact path="/">
                  <Home />
                </Route>

                <Route path="/productlist/edit/:id">
                 <Editproduct />
                </Route>

                <Route path="/productlist">
                 <Productlist />
                </Route>

                <Route path="/createproduct">
                 <Createproduct />
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
        <h2 className="home-hello">Welcome to Our Home Page</h2>
           <img className="home-img" src="https://i.pinimg.com/originals/a2/c3/f9/a2c3f98d8e1145c41dba45d8072afac7.gif" alt="welcome"/>
             <div>
           <Button onClick={()=>history.push("/productlist") }variant="contained">productlist<ArrowForwardIcon/></Button>
       </div>
    </div>
  );
}

//creating not found page
function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  className="not-found-img" src="https://cdn.dribbble.com/users/1138875/screenshots/4669703/404_animation.gif" alt="404 not found"/>
    </div>
  );
}

//crud app is developed by using POST method using API

function Createproduct(){
  
  const history = useHistory();

 // form validation(formik) added using yup

       const formvalidationschema = yup.object({
       productpic: yup.string().required("The url field is required"),
       name: yup.string().required("please enter product name").min(1),
       prize: yup.string().required("why not fill this prize?").min(1)
       });

       const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
       initialValues: { name:"", productpic:"", prize:"" },
       validationSchema: formvalidationschema,
  
       onSubmit: (newProduct) => {
       console.log("onsubmit", newProduct);
       addProduct(newProduct);
       }
       });

const addProduct = (newProduct) =>{
  
 // POST method is used for create the data

       fetch(`https://616d58f537f997001745d9d1.mockapi.io/products`, {
       method:"POST",
       body: JSON.stringify(newProduct),
       headers: {'Content-Type': 'application/json'},
       }).then(()=>history.push("/productlist"));
       };

  return(
    <form onSubmit={handleSubmit} className="create-list-place">
      <TextField id="productpic" 
       name="productpic" 
       value = {values.productpic} 
       onChange={handleChange} 
       onBlur={handleBlur}
       label="enter productpic url" 
       error={errors.productpic && touched.productpic}
       helperText={errors.productpic && touched.productpic && errors.productpic}
       variant="filled" />

      <TextField id="name" 
       name="name" 
       value = {values.name} 
       onChange={handleChange} 
       onBlur={handleBlur}
       label="enter product name" 
       error={errors.name && touched.name}
       helperText={errors.name && touched.name && errors.name}
       variant="filled" />
   
      <TextField id="prize" 
       name="prize" 
       value = {values.prize} 
       onChange={handleChange} 
       onBlur={handleBlur}
       label="enter product prize" 
       error={errors.prize && touched.prize}
       helperText={errors.prize && touched.prize && errors.prize}
       variant="filled" />

      <Button type="submit" variant="contained">Create</Button>
    </form>
  
  );
}

// edit is developed by using GET and PUT method using API

function Editproduct(){
  
  const {id} = useParams();
  const [productdet, setProductdet] = useState(null);
      useEffect(()=>{
      fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${id}`, {method:"GET"})
      .then((data)=>data.json())
      .then((mv)=>setProductdet(mv));
      }, [id]);
//only show update movie when data is available
      return productdet? <Updateproduct productdet={productdet}/>:"";
  
      }


function Updateproduct({productdet}){

// form validation(formik) added using yup

     const formvalidationschema = yup.object({
     productpic: yup.string().required("The url field is required"),
     name: yup.string().required("please enter product name").min(1),
     prize: yup.string().required("why not fill this prize?").min(1)
     });

     const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
     initialValues: { name: productdet.name, productpic:productdet.productpic, prize:productdet.prize },
     validationSchema: formvalidationschema,
  
       onSubmit: (updatedProduct) => {
       console.log("onsubmit", updatedProduct);
       editProduct(updatedProduct);
       }
       });

const history = useHistory();

const editProduct =(updatedProduct)=>{
    console.log(updatedProduct);

// PUT method is used for update the data

       fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${productdet.id}`, {
       method:"PUT",
       body: JSON.stringify(updatedProduct),
       headers: {'Content-Type': 'application/json'},
       }).then(()=>history.push("/productlist"))
       };
       return(
<form onSubmit={handleSubmit} className="create-list-place">

<TextField id="productpic" 
      name="productpic" 
      value = {values.productpic} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter productpic url" 
       error={errors.productpic && touched.productpic}
       helperText={errors.productpic && touched.productpic && errors.productpic}
       variant="filled" />

<TextField id="name" 
      name="name" 
      value = {values.name} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter product name" 
       error={errors.name && touched.name}
       helperText={errors.name && touched.name && errors.name}
       variant="filled" />
   
<TextField id="prize" 
      name="prize" 
      value = {values.prize} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter product prize" 
       error={errors.prize && touched.prize}
       helperText={errors.prize && touched.prize && errors.prize}
       variant="filled" />

    <Button type="submit" variant="contained">Save</Button>
  </form>
  );
}

  
// Productlist developed by using GET method and DELETE method is used for delete list using API

function Productlist(){

  // In usestate initially empty array
  const [product, setProduct] = useState([]);
  // console.log(scientist);
            const getProduct = () =>{
            fetch("https://616d58f537f997001745d9d1.mockapi.io/products")
            .then((data)=>data.json())
            .then((ptd)=>setProduct(ptd));
            };
  useEffect(getProduct, []);

  // DELETE method is used for delete the data
  //after delete and refresh
           const deleteProduct = (id) =>{
           fetch(`https://616d58f537f997001745d9d1.mockapi.io/products/${id}`, {method:"DELETE"})
           .then(()=>getProduct());
            };

  const history = useHistory();
  return(
    <section>
      {product.map(({productpic,name,prize,id})=>(<Listproduct productpic={productpic} name={name} prize={prize} id={id}
          deleteButton= {<IconButton 
           onClick={()=> deleteProduct(id)}
              aria-label="delete" color="error">
                <DeleteIcon />
                  </IconButton>}
                editButton= {<IconButton 
              aria-label="edit"  color="success"
            onClick={()=>history.push("/productlist/edit/" + id)}>
          <EditIcon />
        </IconButton>}
      />))}
    </section>
  );
}

function Listproduct({productpic,name,prize,editButton,deleteButton}){
  return(
  <div className="content-div">
    <div className="detail-div">
      <img className="product-img" src={productpic} alt="profile"/>
       <div className="content-div-name">
         <h2 className="text-deco">Product: {name}</h2>
          <h3 className="text-deco">Prize:  {prize}</h3>
            <div className="edit-delete">
            <Like />
              {editButton}{deleteButton}
            </div>
        </div>
    </div>
  </div>
  );
}


function Like(){
  const [like, setLike] = useState(true)
  return(
    <div>
      <IconButton onClick={()=>setLike(!like)} color="secondary" aria-label="description">{like?<FavoriteBorderIcon/>:<FavoriteIcon/>}</IconButton>
    </div>
  );
}






//reference data

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

