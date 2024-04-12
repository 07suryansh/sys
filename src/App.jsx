
import { Route,Routes,useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Popular from "./Popular"
import Story from "./Story"
import { useEffect } from "react"
import { Category } from "./Category"

function App(){
  const navigate = useNavigate();
  // useEffect(()=>{
  //   navigate('/story');
  // },[])
  return (
    <div className="header">
      <Navbar/>
      {/* <Popular /> */}
      <Routes>
        <Route path="/story" element={<Story />}/>
        <Route path="/category/:id" element={<Category />}/>
      </Routes>
    </div>
  )
}

export default App



