import { BrowserRouter,Routes,Route } from "react-router-dom"
import * as pages from "./pages/index";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<pages.Home/>} />
          <Route path="/dashboard/:id" element={<pages.Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
