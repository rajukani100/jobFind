import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/home";
import Login from "./pages/login/login";
import AboutPage from "./pages/about/about";
import Register from "./pages/register/register";

function App() {
  return (
    <>
      <div className='w-full'>
        <BrowserRouter>
          <Routes>
            <Route path='/about' element={<AboutPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
