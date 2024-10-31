import Card from "../components/Card";
import VoiceInput from "../components/VoiceInput";
import styled from "styled-components";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  margin-bottom: 60px;
`;

const H1 = styled.h1`
  font-size: ${(props) => props.theme.text.h1bd32.fontSize};
  font-weight: ${(props) => props.theme.text.h1bd32.fontWeight};
  line-height: ${(props) => props.theme.text.h1bd32.lineHeight};
  color: ${(props) => props.theme.colors.gray900};
  margin-bottom: 16px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const data = [
  {
    title: "납읍리 섯잣길[동] 정류장1",
    departure: "납읍초등학교",
    destination: "제주 시청",
    buses: [
      {
        busNumber: "255",
        color: "#FF0000",
        stops: 5,
      },
    ],
    isAlertEnabled: true,
  },
  {
    title: "납읍리 섯잣길[동] 정류장2",
    departure: "납읍초등학교",
    destination: "제주 시청",
    buses: [
      {
        busNumber: "180",
        color: "#FF0000",
        stops: 13,
      },
    ],
    isAlertEnabled: false,
  },
];

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState("");

  return (
    <Container>
      <VoiceInput
        originValue={origin}
        destinationValue={destination}
        stopsValue={stops}
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
      <H1>예정된 알림</H1>
      <CardWrapper>
        {data.slice(2, 0).map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </CardWrapper>
    </Container>
  );
};

export default Home;
