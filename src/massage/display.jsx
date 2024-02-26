import {
  Box,
  Flex,
  Text,
  Input,
  VStack,
  Center,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import moment from "moment-timezone";
import "moment/locale/pl";
import { dayNamesMap } from "../helpers/engToPolishDay";

moment.locale("pl");

function Masaz() {
  const [trainingData, setTrainingData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const toast = useToast();
  const trainingColRef = collection(db, "masaze");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getTrainingData = async () => {
    const snapshot = await getDocs(trainingColRef);
    const now = moment.tz("Europe/Warsaw");

    let filteredAndSortedData = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((training) => {
        const trainingDate2 = training.time2
          ? moment.tz(
              `${training.date} ${training.time2}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            )
          : moment.tz(
              `${training.date} ${training.time1}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            );
        return trainingDate2.isAfter(now);
      })
      .sort((a, b) => {
        const dateA = a.time2
          ? moment.tz(
              `${a.date} ${a.time2}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            )
          : moment.tz(
              `${a.date} ${a.time1}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            );
        const dateB = b.time2
          ? moment.tz(
              `${b.date} ${b.time2}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            )
          : moment.tz(
              `${b.date} ${b.time1}`,
              "DD-MM-YYYY HH:mm",
              "Europe/Warsaw"
            );
        return dateA.diff(dateB);
      });

    setTotalPages(filteredAndSortedData.length);
    filteredAndSortedData =
      filteredAndSortedData.length > 0
        ? [filteredAndSortedData[currentPage]]
        : [];
    setTrainingData(filteredAndSortedData);
  };

  console.log(trainingData);

  const handleNext = () => {
    setCurrentPage((current) =>
      current + 1 < totalPages ? current + 1 : current
    );
  };

  const handlePrevious = () => {
    setCurrentPage((current) => (current - 1 >= 0 ? current - 1 : current));
  };

  useEffect(() => {
    getTrainingData();
  }, [currentPage]);

  const handleInputChange = (e, id, timeSlotIndex) => {
    const value = e.target.value;
    setUserInputs({
      ...userInputs,
      [`${id}-${timeSlotIndex}`]: value,
    });
  };

  const registerUser = async (id, timeSlotIndex) => {
    const inputKey = `${id}-${timeSlotIndex}`;
    const userName = userInputs[inputKey];

    if (!userName) {
      toast({
        title: "Error",
        description: "Eee, wystąpił błąd. Skontakuj się z Mają! :/",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const docRef = doc(db, "masaze", id);
    const timeSlot = trainingData.find((data) => data.id === id).timeSlots[
      timeSlotIndex
    ];

    await updateDoc(docRef, {
      [`registrations.${timeSlot}`]: arrayUnion(userName),
    });

    setUserInputs({
      ...userInputs,
      [inputKey]: "",
    });
  };

  const generateInputs = (session) => {
    // Assuming session.registrations and session.timeSlots are defined
    const mergedTimeSlots = session.timeSlots.map((slot) => {
      const registration = session.registrations
        ? session.registrations[slot]
        : null;
      return {
        slot,
        registration: registration ? registration[0] : null,
      };
    });

    return mergedTimeSlots.map(({ slot, registration }, index) => (
      <Box key={index} align="left" w={"267px"}>
        <Flex></Flex>
        <Text mr={4}>{slot}</Text>
        <Flex>
          <Input
            placeholder={!registration ? "Imię i nazwisko" : ""}
            mb={2}
            borderColor="gray.400"
            color="black"
            _hover={{ borderColor: registration ? "gray.200" : "gray.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #4299E1" }}
            w={registration ? "266px" : "80%"}
            bg={registration ? "gray.100" : "white"}
            cursor={registration ? "not-allowed" : "auto"}
            value={registration || userInputs[`${session.id}-${index}`] || ""}
            onChange={(e) => handleInputChange(e, session.id, index)}
            isReadOnly={!!registration}
          />
          {!registration && (
            <Button
              colorScheme="blue"
              ml={2}
              onClick={() => registerUser(session.id, index, slot)}
            >
              Dodaj
            </Button>
          )}
        </Flex>
      </Box>
    ));
  };
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      p={4}
      h="100vh"
      w="100%"
      overflowX="hidden"
      bg="white"
      color="gray.900"
    >
      <Heading mb={4} textAlign={"left"}>
        Masaże
      </Heading>
      <Center mx="auto" flexDir={"column"}>
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          w="300px"
          mx="auto"
          overflowX={"hidden"}
        >
          {trainingData.map((session) => (
            <Box key={session.id} p={4}>
              <Text fontSize="xl" mb={4}>
                {session.date}{" "}
                {dayNamesMap[moment(session.date, "DD-MM-YYYY").format("dddd")]}
              </Text>
              <VStack spacing={4}>{generateInputs(session)}</VStack>
            </Box>
          ))}
        </Box>
        <Flex mt="4">
          <Button onClick={handlePrevious} isDisabled={currentPage <= 0}>
            Poprzedni trening
          </Button>
          <Button
            onClick={handleNext}
            isDisabled={currentPage >= totalPages - 1}
          >
            Następny trening
          </Button>
        </Flex>
      </Center>
    </Flex>
  );
}

export default Masaz;
