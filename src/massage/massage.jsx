import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Heading,
  HStack,
  Text,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import { db } from "../firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import "../admin/datepicker.css";

const Massage = () => {
  const [isRepeating, setIsRepeating] = useState(false);
  const [startTime, setStartTime] = useState({ hour: "", minute: "" });
  const [endTime, setEndTime] = useState({ hour: "", minute: "" });
  const [formData, setFormData] = useState({
    date: new Date(),
  });

  const handleTimeChange = (value, type, isStart) => {
    const updateTime = isStart ? { ...startTime } : { ...endTime };
    if (type === "hour") {
      updateTime.hour = value;
    } else {
      updateTime.minute = value;
    }

    if (isStart) {
      setStartTime(updateTime);
      if (updateTime.hour && updateTime.minute) {
        setFormData((prevState) => ({
          ...prevState,
          startTime: `${updateTime.hour}:${updateTime.minute}`,
        }));
      }
    } else {
      setEndTime(updateTime);
      if (updateTime.hour && updateTime.minute) {
        setFormData((prevState) => ({
          ...prevState,
          endTime: `${updateTime.hour}:${updateTime.minute}`,
        }));
      }
    }
  };
  const handleEndTimeChange = (e) => {
    const [hour, minute] = e.target.value.split(":");
    setFormData((prevState) => ({
      ...prevState,
      endTime: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
    }));
  };

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

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  const calculateTimeSlots = (startTime, endTime) => {
    if (!startTime || !endTime) return [];

    const slots = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);
    const endDate = new Date(0, 0, 0, endHour, endMinute);

    let currentDate = new Date(0, 0, 0, startHour, startMinute);

    while (currentDate <= endDate) {
      slots.push(
        currentDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      currentDate = new Date(currentDate.getTime() + 30 * 60000);
    }

    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = formData.date;
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 3);

      const { date, startTime, endTime } = formData;
      const timeSlots = calculateTimeSlots(startTime, endTime);

      const sessionData = {
        ...formData,
        date: formatDateString(date),
        timeSlots: timeSlots,
      };

      console.log("Session Data: ", sessionData);

      if (isRepeating) {
        for (
          let currentDate = new Date(startDate);
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 7)
        ) {
          const repeatedSessionDate = new Date(currentDate);
          sessionData.date = formatDateString(repeatedSessionDate);
          await addDoc(collection(db, "masaze"), sessionData);
        }
      } else {
        await addDoc(collection(db, "masaze"), sessionData);
      }

      alert("Dodane :)");

      setFormData({
        date: new Date(),
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
        <Heading w="300px" ml="4" as="h3" fontSize="28px" mb={"4"}>
          Masaż
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
              <FormControl>
                <FormLabel>Od:</FormLabel>
                <HStack>
                  <Select
                    onChange={(e) =>
                      handleTimeChange(e.target.value, "hour", true)
                    }
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
                    onChange={(e) =>
                      handleTimeChange(e.target.value, "minute", true)
                    }
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
                <FormLabel>Do:</FormLabel>
                <HStack>
                  <Select
                    onChange={(e) =>
                      handleTimeChange(e.target.value, "hour", false)
                    }
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
                    onChange={(e) =>
                      handleTimeChange(e.target.value, "minute", false)
                    }
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

              <Tooltip label="Jesli zaznaczone, to wtedy co tydzien ten masaż sie automatycznie wyswietli uzytkownikom przez 3 miesiace.">
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

export default Massage;
