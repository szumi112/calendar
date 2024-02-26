import React from "react";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./admin/Admin";
import Landing from "./Landing";
import Massage from "./massage/massage";
import { useNavigate } from "react-router-dom";
import Masaz from "./massage/display";

function App() {
  const navigate = useNavigate();
  return (
    <Box>
      <Routes>
        <Route
          path="/"
          element={
            <Center mt="100px" h="225px" w="400px" mx="auto" flexDir="column">
              <Text mb="65px" fontSize="26px" color="black" fontWeight="500">
                Zapisz się na:
              </Text>
              <Flex>
                <Button
                  onClick={() => navigate("/gym")}
                  mr={8}
                  colorScheme="blue"
                  size="lg"
                  shadow="md"
                >
                  Siłownie
                </Button>
                <Button
                  onClick={() => navigate("/massage")}
                  ml={8}
                  colorScheme="blue"
                  size="lg"
                  shadow="md"
                >
                  Masaż
                </Button>
              </Flex>
            </Center>
          }
        />

        <Route path="/gym" element={<Landing />} />
        <Route path="/massage" element={<Masaz />} />
        <Route path="/trening" element={<Admin />} />
        <Route path="/masaz" element={<Massage />} />
      </Routes>
    </Box>
  );
}

export default App;
