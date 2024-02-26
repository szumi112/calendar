// useTrainingData.js
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase-config";
import moment from "moment-timezone";

const useTrainingData = (currentPage) => {
  const [trainingData, setTrainingData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTrainingData = async () => {
      const trainingColRef = collection(db, "treningi");
      const snapshot = await getDocs(trainingColRef);
      const now = moment.tz("Europe/Warsaw");

      // Your data manipulation logic here

      setTotalPages(filteredAndSortedData.length);
      setTrainingData(filteredAndSortedData);
    };

    fetchTrainingData();
  }, [currentPage]);

  return { trainingData, totalPages };
};

export default useTrainingData;
