import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { CyclesContextProvider } from "./Context/NewCycleContext";
import { Router } from "./Router";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";


export function App() {
  return (
    <BrowserRouter>
    <CyclesContextProvider >
    <ThemeProvider theme={defaultTheme}>
    <Router/>
     
     <GlobalStyle/>
     </ThemeProvider>
     </CyclesContextProvider>
   </BrowserRouter>
  )
}

