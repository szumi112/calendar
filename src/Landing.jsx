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
import { db } from "./firebase/firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import moment from "moment-timezone";

function Landing() {
  const [trainingData, setTrainingData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const toast = useToast();
  const trainingColRef = collection(db, "treningi");
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

  const handleInputChange = (e, id, timeSlot) => {
    const value = e.target.value;
    setUserInputs({
      ...userInputs,
      [`${id}-${timeSlot}`]: value,
    });
  };

  const registerUser = async (id, timeSlot) => {
    const inputKey = `${id}-${timeSlot}`;
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

    const docRef = doc(db, "treningi", id);
    await updateDoc(docRef, {
      [timeSlot]: arrayUnion(userName),
    });

    setUserInputs({
      ...userInputs,
      [inputKey]: "",
    });

    getTrainingData();

    toast({
      title: "Success",
      description: "Zapisany na trening :)",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const generateInputs = (count, id, timeSlot) => {
    let inputs = [];

    const registeredUsers = [];
    for (let i = 0; i < count; i++) {
      const usersForSlot = trainingData.find((data) => data.id === id)[
        `${timeSlot}-${i}`
      ];
      if (usersForSlot && usersForSlot.length > 0) {
        registeredUsers.push(usersForSlot[0]);
      } else {
        registeredUsers.push("");
      }
    }

    for (let i = 0; i < count; i++) {
      const userValue = registeredUsers[i];
      const inputKey = `${id}-${timeSlot}-${i}`;

      inputs.push(
        <Flex key={i}>
          <Input
            placeholder={!userValue ? "Imię i nazwisko" : ""}
            mb={2}
            borderColor="gray.400"
            color="black"
            _hover={{ borderColor: userValue ? "gray.200" : "gray.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #4299E1" }}
            value={userValue || userInputs[inputKey] || ""}
            onChange={(e) => handleInputChange(e, id, `${timeSlot}-${i}`)}
            isReadOnly={!!userValue}
            w={userValue ? "266px" : "80%"}
            bg={userValue ? "gray.100" : "white"}
            cursor={userValue ? "not-allowed" : "auto"}
          />
          {!userValue && (
            <Button
              colorScheme="blue"
              ml="2"
              borderRadius="4px"
              onClick={() => registerUser(id, `${timeSlot}-${i}`)}
            >
              Dodaj
            </Button>
          )}
        </Flex>
      );
    }

    return inputs;
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
      <Center mx="auto" flexDir={"column"}>
        <Heading
          as="h1"
          size="xl"
          mb={4}
          mt={{ base: "20%", md: "10%", lg: 0 }}
          textAlign={"center"}
        >
          Zapisy na treningi
        </Heading>
        {trainingData?.map((data, index) => (
          <Box
            key={data.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            m={2}
            w="300px"
            mx="auto"
            border="1px solid grey"
          >
            <Text fontSize="xl" mb={4}>
              {data.date}
            </Text>
            <VStack spacing={4}>
              <Box>
                <Text mb={2}>
                  {data.time1} - {data.people1} miejsca
                </Text>
                {generateInputs(
                  Number(data.people1),
                  data.id,
                  "time1",
                  data.time1Users || []
                )}
              </Box>
              {data.time2 && (
                <Box>
                  <Text mb={2}>
                    {data.time2} - {data.people2} miejsca
                  </Text>
                  {generateInputs(
                    Number(data.people2),
                    data.id,
                    "time2",
                    data.time2Users || []
                  )}
                </Box>
              )}
            </VStack>
          </Box>
        ))}
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

export default Landing;
