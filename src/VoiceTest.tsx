import { useCallback, useEffect, useState } from "react";

import OpenAI from "openai";
import styled from "styled-components";

interface Route {
  departures: string;
  destinations: string;
  stops: number;
}

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

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const VoiceTest = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.");
    }
  }, []);

  const callOpenAI2 = async (text: string) => {
    const userInput = `${text}---------
    이게 사용자로부터 온 문장인데 여기서 출발지, 도착지, 정류장을 추출해서 그것만 뽑아줘
    3개의 단어가 나올거 잖아 각각 ,을 구분해서 줘 예로 들어서 서울,인천,3
    아 추가로 오개전이면 5로 해석 즉 십개전이면 10 이런식으로 해야돼`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "너는 뉴스 주요문장을 생성해주는 사람이야",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "response",
          schema: {
            type: "object",
            properties: {
              departures: {
                description: "출발지",
                type: "string",
              },
              destinations: {
                description: "도착지",
                type: "string",
              },
              stops: {
                description: "정류장수",
                type: "number",
              },
            },
            additionalProperties: false,
          },
        },
      },
    });

    console.log("입력", completion.choices[0].message.content);

    const jsonString = completion.choices[0].message.content;
    if (jsonString === null) return;
    const route: Route = JSON.parse(jsonString);
    if (route.stops === 0) route.stops = 5;
    setAiResponse(
      `출발지: ${route.departures}, 도착지: ${route.destinations}, 정류장수: ${route.stops}`
    );
  };

  const handleRecording = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();

    newRecognition.lang = "ko-KR";
    newRecognition.interimResults = false;
    newRecognition.maxAlternatives = 1;

    newRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      console.log("Confidence:", event.results[0][0].confidence);
      callOpenAI2(transcript);
    };

    newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      alert(`오류 발생: ${event.error}`);
    };

    newRecognition.onspeechend = () => {
      newRecognition.stop();
    };

    newRecognition.onend = () => {
      setIsRecording(false);
    };

    newRecognition.start();
    setIsRecording(true);
  }, []);

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
        value={aiResponse}
        placeholder="AI가 추출한 정보가 여기에 표시됩니다."
        readOnly
      />
    </Container>
  );
};

export default VoiceTest;
