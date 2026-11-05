import './App.css'
import Footer from './components/Footer'
import AppRoutes from "./routes/AppRoutes";

function App() {

  return (
    <div className='bg-black'>
      <AppRoutes/>
      <Footer/>
    </div>
  )
}

export default App
