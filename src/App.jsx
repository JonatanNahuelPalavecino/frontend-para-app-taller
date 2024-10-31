import "./App.css"
import Layout from "./components/Layout/Layout"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from "./components/Context/Context"

function App() {
  
  return (
    <>
      <ContextProvider>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Layout/>
      </ContextProvider>
    </>
  )
}

export default App
