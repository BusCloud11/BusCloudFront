import Card from "../components/Card";
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

const data = [
  {
    title: "납읍리 섯잣길[동] 정류장1",
    departure: "납읍초등학교",
    destination: "제주 시청",
    alertTime: "12:00 ~ 15:00",
    alertStop: 5,
    isAlertEnabled: true,
    onToggleAlert: () => {
      console.log("toggle alert1");
    },
    onDeleteAlert: () => {
      console.log("delete alert1");
    },
  },
  {
    title: "납읍리 섯잣길[동] 정류장2",
    departure: "납읍초등학교",
    destination: "제주 시청",
    alertTime: "12:00 ~ 15:00",
    alertStop: 5,
    isAlertEnabled: false,
    onToggleAlert: () => {
      console.log("toggle alert2");
    },
    onDeleteAlert: () => {
      console.log("delete alert2");
    },
  },
  {
    title: "납읍리 섯잣길[동] 정류장3",
    departure: "납읍초등학교",
    destination: "제주 시청",
    alertTime: "12:00 ~ 15:00",
    alertStop: 3,
    isAlertEnabled: true,
    onToggleAlert: () => {
      console.log("toggle alert3");
    },
    onDeleteAlert: () => {
      console.log("delete alert3");
    },
  },
];

const Favorite = () => {
  return (
    <Container>
      <H1>즐겨찾는 노선</H1>
      <CardWrapper>
        {data.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </CardWrapper>
    </Container>
  );
};

export default Favorite;
