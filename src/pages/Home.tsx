import { useEffect, useState } from "react";

import Card from "../components/Card";
import { GetBusListResponseType } from "../utils/get-bus-list";
import VoiceInput from "../components/VoiceInput";
import axios from "axios";
import { getBusRoute } from "../utils/get-bus-route";
import { postBusSave } from "../utils/post-bus-save";
import styled from "styled-components";
import { transAddressToXY } from "../utils/trans-address-to-xy";
import { useVoiceRecognition } from "../hooks/use-voice-recognition";

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

const mockDatas: GetBusListResponseType[] = [
  {
    id: 1,
    departure: "납읍초등학교",
    destination: "제주 시청",
    station: 5,
    time: "12:00 ~ 15:00",
    alarm: true,
    favorite: true,
    notionId: 1,
    stationId: 1,
    frequency: 1,
  },
];

type BusInfoType = {
  infoState: "notFound" | "error" | "normal";
  routeNumber: string; // 노선 번호
  predictionTime: number; // 현재 정류장까지 도착 예정 시간 (분)
  remainStation: number; // 현재 정류장까지 남은 정류장 수
  plateNumber: string; // 버스 차량번호 (아래 달려 있는 판넬)
};

const NOT_FOUND_BUS_INFO: BusInfoType = {
  infoState: "notFound",
  routeNumber: "-1",
  predictionTime: 0,
  remainStation: 0,
  plateNumber: "-2",
} as const;

const ERROR_BUS_INFO: BusInfoType = {
  infoState: "error",
  routeNumber: "-2",
  predictionTime: 0,
  remainStation: 0,
  plateNumber: "-2",
} as const;

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState("");
  const { isRecording, aiResponse, handleRecording } = useVoiceRecognition();
  const [busList, setBusList] = useState<GetBusListResponseType[]>([]);
  const [busInfo, setBusInfo] = useState<BusInfoType>(NOT_FOUND_BUS_INFO);

  const getBusss = async () => {
    // const data = await getBusList()
    const data = mockDatas;
    setBusList(data);
  };

  useEffect(() => {
    getBusss();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const stationId = busList[0].stationId;
      const routeId = busList[0].notionId;
      try {
        const response = await axios.get(
          "/api/jeju-bus/api/searchArrivalInfoList.do",
          {
            params: {
              station_id: stationId,
            },
          }
        );
        const busInfos = response.data;
        if (busInfos.length === 0) {
          setBusInfo(NOT_FOUND_BUS_INFO);
          return;
        }
        const targetBusInfos = busInfos.filter(
          (busInfo: BusInfoType) => Number(busInfo.routeNumber) === routeId
        );
        targetBusInfos.sort(
          (aBus: BusInfoType, bBus: BusInfoType) =>
            aBus.predictionTime - bBus.predictionTime
        );
        const nearestBusInfo = targetBusInfos[0];
        setBusInfo({ ...nearestBusInfo, type: "normal" });
      } catch {
        setBusInfo(ERROR_BUS_INFO);
      }
    }, 10 * 1000);
    return () => clearInterval(timer);
  }, [busList]);

  useEffect(() => {
    if (!aiResponse) return;
    setOrigin(aiResponse.departures);
    setDestination(aiResponse.destinations);
    setStops(aiResponse.stops.toString());
    console.log(aiResponse);
  }, [aiResponse]);

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
        onMicClick={() => {
          handleRecording();
        }}
        onResetClick={() => {
          setOrigin("");
          setDestination("");
          setStops("");
        }}
        onConfirmClick={async () => {
          // 1. 구글 api 호출
          const startXY = await transAddressToXY(origin);
          const endXY = await transAddressToXY(destination);

          console.log(startXY, endXY);

          // 2. tmap api 호출
          const busRoute = await getBusRoute(startXY, endXY);
          console.log(busRoute);

          if (!busRoute) return null;

          const departure = origin;
          const station = Number(stops);
          const stationId = busRoute.sStationId;
          const notionId = busRoute.routeNum;
          const time = getCurTime();
          try {
            const res = await postBusSave({
              departure,
              destination,
              station,
              stationId,
              notionId,
              time,
            });
            await getBusss();
            return res;
          } catch {
            return null;
          }
        }}
        isListening={isRecording}
      />
      <H1>예정된 알림</H1>
      <CardWrapper>
        {/* {data.slice(2, 0).map((item) => (
          <Card key={item.title} {...item} />
        ))} */}
        {busList.length > 0 && (
          <Card
            title={busList[0].departure}
            departure={busList[0].departure}
            destination={busList[0].destination}
            buses={[
              {
                busNumber: busInfo.plateNumber,
                color: "#FF0000",
                stops: busInfo.remainStation,
              },
            ]}
            isAlertEnabled={busList[0].alarm}
          />
        )}
      </CardWrapper>
    </Container>
  );
};

export default Home;

const getCurTime = () => {
  const now = Date.now();
  const hours = new Date(now).getHours();
  const minutes = new Date(now).getMinutes();
  return `${hours}:${minutes}`;
};
