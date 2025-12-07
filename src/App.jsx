import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login/Login.jsx';
import { Register } from './pages/Register/Register.jsx';
import { Layout } from './layouts/Layout.jsx';
import { Home } from './pages/Home/Home.jsx';
import { MovieDetail } from './pages/MovieDetail/MovieDetail.jsx';
import { SetupProfile } from "./pages/SetupProfile/SetupProfile";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="movie/:id" element={<MovieDetail />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/setup-profile" element={<SetupProfile />} />

            </Routes>
        </>
    )
}

export default App;
