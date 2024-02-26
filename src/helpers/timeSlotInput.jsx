export const TimeSlot = ({ time, people, id, timeUsers }) => (
  <Box>
    <Text mb={2}>
      {time} - {people} miejsca
    </Text>
    {generateInputs(Number(people), id, time, timeUsers || [])}
  </Box>
);
