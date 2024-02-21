import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { db } from "./firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";

const Admin = () => {
  const [formData, setFormData] = useState({
    date: "",
    time1: "",
    people1: "",
    time2: "",
    people2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "treningi"), {
        ...formData,
        time1Users: [],
        time2Users: [],
      });
      alert("Dodane :)");
      setFormData({
        date: "",
        time1: "",
        people1: "",
        time2: "",
        people2: "",
      });
    } catch (error) {
      console.error("Wystąpił bląd :/ ", error);
      alert("Wystąpił bląd :/");
    }
  };

  return (
    <Box h="100vh" mt="10%">
      <Center mx="auto" w="100vw" flexDir={"column"}>
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          w="300px"
          mx="auto"
          overflowX={"hidden"}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Kiedy?</FormLabel>
                <Input
                  name="date"
                  type="text"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder={"DD-MM-YYYY (np. 18-01-2029)"}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Czas 1szego treningu</FormLabel>
                <Input
                  name="time1"
                  type="text"
                  value={formData.time1}
                  onChange={handleChange}
                  placeholder="HH:MM (np. 18:00)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Ilość osób na 1szy trening</FormLabel>
                <Input
                  name="people1"
                  type="text"
                  value={formData.people1}
                  onChange={handleChange}
                  placeholder="Podaj numer"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Czas 2ego treningu</FormLabel>
                <Input
                  name="time2"
                  type="text"
                  value={formData.time2}
                  onChange={handleChange}
                  placeholder="HH:MM (np. 18:00)"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ilość osób na 2gi trening</FormLabel>
                <Input
                  name="people2"
                  type="text"
                  value={formData.people2}
                  onChange={handleChange}
                  placeholder="Podaj numer"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Stwórz trening
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

export default Admin;
