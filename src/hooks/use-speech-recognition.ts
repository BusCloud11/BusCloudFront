import OpenAI from "openai";
import { useCallback, useEffect, useState } from 'react';

interface Route {
  departures: string;
  destinations: string;
  stops: number;
}

interface UseVoiceRecognitionReturn {
  isRecording: boolean;
  recognizedText: string;
  aiResponse: Route | null;
  handleRecording: () => void;
}

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [aiResponse, setAiResponse] = useState<Route|null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.");
    }
  }, []);

  const processWithAI = async (text: string) => {
    try {
      const userInput = `다음 텍스트에서 출발지, 도착지, 정류장 수를 추출해주세요: ${text}
      출력 형식: JSON 형태로 {"departures": "출발지", "destinations": "도착지", "stops": 숫자}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "사용자의 음성에서 출발지, 도착지, 정류장 수를 추출하여 JSON 형식으로 응답하는 어시스턴트입니다."
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        temperature: 0.3,
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) return;

      try {
        const route: Route = JSON.parse(responseText);
        if (route.stops === 0) route.stops = 5;
        setAiResponse({ ...route });
      } catch (error) {
        console.error("JSON 파싱 에러:", error);
        setAiResponse(null);
      }
    } catch (error) {
      console.error("OpenAI API 에러:", error);
      setAiResponse(null);
    }
  };

  const handleRecording = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();

    newRecognition.lang = "ko-KR";
    newRecognition.interimResults = false;
    newRecognition.maxAlternatives = 1;

    newRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      console.log("Confidence:", event.results[0][0].confidence);
      processWithAI(transcript);
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

  return {
    /** 녹음 중인지 여부 */
    isRecording,
    /** 인식된 텍스트 */
    recognizedText,
    /** AI 응답 */
    aiResponse,
    /** 녹음 시작 */
    handleRecording,
  };
};