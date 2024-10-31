import axios from "axios";
import { getBusRoute } from "./utils/get-bus-route";
import styled from "styled-components";
import { transAddressToXY } from "./utils/trans-address-to-xy";
import { useVoiceRecognition } from "./hooks/use-voice-recognition";

const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 50px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
`;

const Button = styled.button<{ isRecording: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.isRecording ? "#ff4444" : "#4CAF50")};
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isRecording ? "#ff6666" : "#45a049")};
  }
`;

const Status = styled.div<{ isRecording: boolean }>`
  margin-top: 20px;
  font-weight: bold;
  color: ${(props) => (props.isRecording ? "red" : "green")};
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  font-size: 16px;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const VoiceTest = () => {
  const { isRecording, recognizedText, aiResponse, handleRecording } =
    useVoiceRecognition();

  const onSubmit = async () => {
    if (!aiResponse) {
      alert("AI 응답이 없었다.");
      return;
    }

    if (!aiResponse.stops) {
      alert("정류장 수가 없다.");
      return;
    }
    if (!aiResponse.departures) {
      alert("출발지가 없다.");
      return;
    }
    if (!aiResponse.destinations) {
      alert("도착지가 없다.");
      return;
    }
    const startXY = await transAddressToXY(aiResponse.departures, true);
    const endXY = await transAddressToXY(aiResponse.destinations);

    const busRoute = await getBusRoute(startXY, endXY);

    const departure = aiResponse.departures;
    const destination = aiResponse.destinations;
    const station = aiResponse.stops;
    const stationId = busRoute?.sStationId;
    const notionId = busRoute?.routeNum.split(":")[1];
    const time = getCurTime();

    const accessToken = localStorage.getItem("accessToken");
    console.log(departure, destination, station, stationId, notionId, time);
    const response = await axios.post(
      "/api/bus/save",
      {
        departure,
        destination,
        station,
        stationId,
        notionId,
        time,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      alert("저장 완료");
      console.log(response.data);
    } else {
      alert("저장 실패");
    }
  };

  return (
    <Container>
      <Title>음성 인식 및 AI 연동 예제</Title>
      <Button onClick={handleRecording} isRecording={isRecording}>
        {isRecording ? "녹음 중지" : "녹음 시작"}
      </Button>
      <Status isRecording={isRecording}>
        {isRecording ? "녹음 중... 말을 시작하세요." : "녹음 대기 중"}
      </Status>
      <br />
      <Input
        type="text"
        value={recognizedText}
        placeholder="인식된 텍스트가 여기에 표시됩니다."
        readOnly
      />
      <br />
      <Input
        type="text"
        value={aiResponse ? `출발지: ${aiResponse.departures}` : ""}
        placeholder="AI가 추출한 정보 중 출발지"
        readOnly
      />
      <Input
        type="text"
        value={aiResponse ? `출발지: ${aiResponse.destinations}` : ""}
        placeholder="AI가 추출한 정보 중 도착지"
        readOnly
      />
      <Input
        type="text"
        value={aiResponse ? `출발지: ${aiResponse.stops}` : "0"}
        placeholder="AI가 추출한 정보 중 정류장 수"
        readOnly
      />

      <Button onClick={onSubmit} isRecording={isRecording}>
        서버로 전송
      </Button>
    </Container>
  );
};

export default VoiceTest;

const getCurTime = () => {
  const now = Date.now();
  const hours = new Date(now).getHours().toString().padStart(2, "0");
  const minutes = new Date(now).getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
