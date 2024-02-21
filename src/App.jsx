import React from "react";
import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import Landing from "./Landing";

function App() {
  return (
    <Router>
      <Box>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/maja" element={<Admin />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
