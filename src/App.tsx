import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/home";
import Job from "./pages/job/job";
import Login from "./pages/login/login";
import AboutPage from "./pages/about/about";
import Register from "./pages/register/register";
import AuthProvider from "./contexts/authProvider";

function App() {



  return (
    <>
      <div className='w-full'>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/job/:id' element={<Job />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/' element={<HomePage />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='*' element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>

      </div>
    </>
  );
}

export default App;
