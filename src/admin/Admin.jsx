import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Switch,
  HStack,
  Text,
  Tooltip,
  Select,
  Heading,
} from "@chakra-ui/react";
import { db } from "../firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

const Admin = () => {
  const [isRepeating, setIsRepeating] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    time1: "",
    people1: "",
    time2: "",
    people2: "",
  });

  const formatDateString = (date) => {
    if (!(date instanceof Date)) {
      console.error("formatDateString expects a Date object");
      return "";
    }
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("time")) {
      const timeType = name.includes("time1") ? "time1" : "time2";
      const valueType = name.endsWith("hour") ? "hour" : "minute";

      const currentTime = formData[timeType]
        ? formData[timeType].split(":")
        : ["00", "00"];
      const newTime = {
        hour: valueType === "hour" ? value.padStart(2, "0") : currentTime[0],
        minute:
          valueType === "minute" ? value.padStart(2, "0") : currentTime[1],
      };

      setFormData((prevState) => ({
        ...prevState,
        [timeType]: `${newTime.hour}:${newTime.minute}`,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = formData.date;
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 3);

      const trainingSessions = [];

      if (isRepeating) {
        for (
          let currentDate = new Date(startDate);
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 7)
        ) {
          const sessionDate = new Date(currentDate);
          const sessionData = {
            ...formData,
            date: formatDateString(sessionDate),
            time1Users: [],
            time2Users: [],
          };
          trainingSessions.push(sessionData);
        }
      } else {
        const sessionData = {
          ...formData,
          date: formatDateString(formData.date),
          time1Users: [],
          time2Users: [],
        };
        trainingSessions.push(sessionData);
      }

      for (const session of trainingSessions) {
        console.log(session);
        // await addDoc(collection(db, "treningi"), session);
      }

      alert("Dodane :)");

      setFormData({
        date: new Date(),
        time1: "",
        people1: "",
        time2: "",
        people2: "",
      });
      setIsRepeating(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Wystąpił błąd :/");
    }
  };

  return (
    <Box h="100vh" mt="10%">
      <Center>
        {" "}
        <Heading w="300px" ml="4" as="h3" fontSize="28px" mb={"4"}>
          Treningi na siłowni
        </Heading>
      </Center>

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
              <FormControl isRequired w="100%">
                <FormLabel>Kiedy?</FormLabel>
                <DatePicker
                  selected={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD-MM-YYYY"
                  minDate={new Date()}
                  className="react-datepicker-custom"
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl isRequired>
                  <FormLabel>Czas 1 treningu</FormLabel>
                  <HStack>
                    <Select
                      name="time1hour"
                      onChange={handleChange}
                      placeholder="Godzina"
                    >
                      {[...Array(24).keys()].map((hour) => (
                        <option
                          key={hour}
                          value={hour.toString().padStart(2, "0")}
                        >
                          {hour.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </Select>
                    <Select
                      name="time1minute"
                      onChange={handleChange}
                      placeholder="Minuta"
                    >
                      {["00", "15", "30", "45"].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </FormControl>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Ilość osób na 1 trening</FormLabel>
                <Input
                  name="people1"
                  type="number"
                  value={formData.people1}
                  onChange={handleChange}
                  placeholder="Podaj numer"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Czas 2 treningu</FormLabel>
                <HStack>
                  <Select
                    name="time2hour"
                    onChange={handleChange}
                    placeholder="Godzina"
                  >
                    {[...Array(24).keys()].map((hour) => (
                      <option
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                      >
                        {hour.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </Select>
                  <Select
                    name="time2minute"
                    onChange={handleChange}
                    placeholder="Minuta"
                  >
                    {["00", "15", "30", "45"].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </Select>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Ilość osób na 2 trening</FormLabel>
                <Input
                  name="people2"
                  type="number"
                  value={formData.people2}
                  onChange={handleChange}
                  placeholder="Podaj numer"
                />
              </FormControl>

              <Tooltip label="Jesli zaznaczone, to wtedy co tydzien ten trening sie automatycznie wyswietli uzytkownikom przez 3 miesiace.">
                <FormControl mt={4}>
                  <Checkbox
                    id="repeating"
                    isChecked={isRepeating}
                    onChange={(e) => setIsRepeating(e.target.checked)}
                  >
                    <Text>Automatyczne odnowienie</Text>
                  </Checkbox>
                </FormControl>
              </Tooltip>
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
