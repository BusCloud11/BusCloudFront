import { GetBusListResponseType, getBusList } from "../utils/get-bus-list";
import { useEffect, useState } from "react";

import Card from "../components/Card";
import { postBusAlarm } from "../utils/post-bus-alarm";
import { postBusFavorite } from "../utils/post-bus-favorite";
import styled from "styled-components";

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

const Favorite = () => {
  const [busList, setBusList] = useState<GetBusListResponseType[]>([]);
  const [flag, setFlag] = useState(false);

  const getBusss = async () => {
    const data = await getBusList();
    setBusList(data);
  };

  useEffect(() => {
    getBusss();
  }, [flag]);

  return (
    <Container>
      <H1>즐겨찾는 경로</H1>
      <CardWrapper>
        {busList.map((item) => (
          <Card
            key={item.id}
            title={item.departure}
            departure={item.departure}
            destination={item.destination}
            alertTime={item.time}
            alertStop={item.station}
            isAlertEnabled={item.alarm}
            onToggleAlert={() => {
              postBusAlarm(item.id, !item.alarm);
              setFlag(!flag);
            }}
            onDeleteAlert={() => {
              postBusFavorite({ id: item.id, favorite: false });
              setFlag(!flag);
            }}
          />
        ))}
      </CardWrapper>
    </Container>
  );
};

export default Favorite;
