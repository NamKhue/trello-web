// import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { RequireAuth } from "react-auth-kit";

// import Login from "~/components/Authen/Login/Login";
import HomePage from "~/pages/Boards";
import Board from "~/pages/Boards/_id";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // <RequireAuth loginPath="/login">
            <HomePage />
            // </RequireAuth>
          }
        />

        <Route
          path="/board/:id"
          element={
            // <RequireAuth loginPath="/login">
            <Board />
            // </RequireAuth>
          }
        />

        {/* <Route path="/login" element={<Login />}></Route> */}
      </Routes>

      {/* <Login /> */}
    </Router>
  );
}

export default App;
