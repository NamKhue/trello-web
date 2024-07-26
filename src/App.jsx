import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";

import Board from "~/pages/Boards/_id";
import Login from "~/components/Authen/Login/Login";

function App() {
  return (
    <>
      {/* <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Board />
            </RequireAuth>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes> */}

      <Board />
      {/* <Login /> */}
    </>
  );
}

export default App;
