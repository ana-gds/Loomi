import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ButtonPink } from './components/ui/Button/ButtonPink.jsx';
import {ButtonWhite} from "./components/ui/Button/ButtonWhite.jsx";
import {Searchbar} from "./components/ui/SearchBar/SearchBar.jsx";
import {InputL} from "./components/ui/Input/Input.jsx";

function App() {


  return (
    <>
    <ButtonPink
        label="Favoritos"
    />
    <ButtonWhite
        icon={<i className=" bi bi-play-fill"></i>}
    />
    <Searchbar
        onChange={(e) => console.log(e.target.value)}
    />

      <InputL
            label="Email"
            placeholder="Enter your email"
            icon={<i className="bi bi-envelope text-white/70"></i>}
            onChange={(e) => console.log(e.target.value)}
        />
      </>
  )
}

export default App
