import './App.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import AppRoutes from './routes/Approutes'

function App() {

  return (
    <div className='bg-black'>
      <AppRoutes/>
      <Footer/>
    </div>
  )
}

export default App
