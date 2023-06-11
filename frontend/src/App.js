//import "./App.css";
import React from "react";
import Login from "./component/Authentication/Login";
import Register from "./component/Authentication/Register";
import Dashboard from "./component/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Router>
      <Routes>
        {/* <AuthContext.Provider
          value={{
            state,
            dispatch,
          }}
        > */}
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        {/* </AuthContext.Provider> */}
      </Routes>
    </Router>
  );
}

export default App;
