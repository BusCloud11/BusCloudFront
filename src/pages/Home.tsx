import VoiceInput from "../components/VoiceInput";
import { useState } from "react";

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState("3");

  return (
    <VoiceInput
      originValue={origin}
      destinationValue={destination}
      stopsValue={stops}
      onOriginFocus={() => {}}
      onDestinationFocus={() => {}}
      onStopsFocus={() => {}}
      onOriginChange={(e) => {
        setOrigin(e.target.value);
      }}
      onDestinationChange={(e) => {
        setDestination(e.target.value);
      }}
      onStopsChange={(e) => {
        setStops(e.target.value);
      }}
      onMicClick={() => {}}
      isListening={false}
    />
  );
};

export default Home;
