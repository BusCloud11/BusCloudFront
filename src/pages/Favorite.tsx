import { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { GetBusListResponseType } from "../utils/get-bus-list";
import { postBusAlarm } from "../utils/post-bus-alarm";
import { postBusFavorite } from "../utils/post-bus-favorite";

const Container = styled.div`
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
  }
]

const Favorite = () => {
  const [busList, setBusList] = useState<GetBusListResponseType[]>([])

  const getBusss = async () => { 
    // const data = await getBusList()
    const data = mockDatas
    setBusList(data)
  }
  useEffect(() => { 
    getBusss();
  },[])

  return (
    <Container>
      <H1>즐겨찾는 노선</H1>
      <CardWrapper>
        {busList.map((item) => (
          <Card key={item.id}
            title={item.departure}
            departure={item.departure}
            destination={item.destination}
            alertTime={item.time}
            alertStop={item.station}
            isAlertEnabled={item.alarm}
            onToggleAlert={() => {
              postBusAlarm(item.id, !item.alarm)
            }}
            onDeleteAlert={() => {
              postBusFavorite({id: item.id, favorite: false})
            }}
          />
        ))}
      </CardWrapper>
    </Container>
  );
};

export default Favorite;
