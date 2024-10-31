import { useEffect, useState } from "react";

import { AdjustInput } from "./AdjustInput";
import icClose from "../assets/icClose.svg";
import icMic from "../assets/icMic.svg";
import icPlus from "../assets/icPlus.svg";
import { keyframes } from "styled-components";
import styled from "styled-components";

interface VoiceInputProps {
  originValue: string;
  destinationValue: string;
  stopsValue: string;
  onOriginFocus?: () => void;
  onDestinationFocus?: () => void;
  onStopsFocus?: () => void;
  onOriginChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDestinationChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStopsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMicClick?: () => void;
  isListening?: boolean;
}

interface CloseButtonProps {
  onClick?: () => void;
}

interface MicButtonProps {
  isListening?: boolean;
  onClick?: () => void;
}

const VoiceInputContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  background-color: ${(props) => props.theme.colors.gray50};
  border-radius: ${(props) => (props.isOpen ? "24px" : "12px")};
  padding: ${(props) => (props.isOpen ? "72px 24px" : "16px")};
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: all 0.2s;
  margin-bottom: 40px;
`;

const Title = styled.div`
  text-align: center;
  margin: 0 auto 20px auto;
  color: ${(props) => props.theme.colors.gray700};
  font-size: ${(props) => props.theme.text.t1md20.fontSize};
  font-weight: ${(props) => props.theme.text.t1md20.fontWeight};
  line-height: ${(props) => props.theme.text.t1md20.lineHeight};
`;

const CloseButtonContainer = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
`;

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <CloseButtonContainer onClick={onClick}>
      <img src={icClose} alt="Close" />
    </CloseButtonContainer>
  );
};

const MicButtonContainer = styled.button<{ isListening?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isListening
      ? props.theme.colors.redStrong
      : props.theme.colors.orange03};
  border: none;
  cursor: pointer;
  margin: 48px auto 0;

  img {
    width: 44px;
    height: 44px;
  }
`;

const pulse = keyframes`
  0% {
    background-color: red;
  }
  50% {
    background-color: #f06c6c;
  }
  100% {
    background-color: red;
  }
`;

const RecordAnimation = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: red;
  animation: ${pulse} 2s infinite;
`;

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <MicButtonContainer isListening={isListening} onClick={onClick}>
      {isListening ? <RecordAnimation /> : <img src={icMic} alt="Mic" />}
    </MicButtonContainer>
  );
};

const AddBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: ${(props) => props.theme.text.b1md16.fontSize};
  font-weight: ${(props) => props.theme.text.b1md16.fontWeight};
  line-height: ${(props) => props.theme.text.b1md16.lineHeight};
  border: 1px solid ${(props) => props.theme.colors.gray100};

  &:hover {
    cursor: pointer;
  }
`;

export const VoiceInput = ({
  originValue,
  destinationValue,
  stopsValue,
  onOriginFocus,
  onDestinationFocus,
  onStopsFocus,
  onOriginChange,
  onDestinationChange,
  onStopsChange,
  onMicClick,
  isListening,
}: VoiceInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const originInput = document.getElementById("originInput");
    if (originInput) {
      originInput.focus();
    }
  }, [isOpen]);

  return (
    <VoiceInputContainer isOpen={isOpen}>
      {!isOpen ? (
        <AddBox
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img src={icPlus} />
          <span>새 알림 등록하기</span>
        </AddBox>
      ) : (
        <>
          <CloseButton
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <Title>이렇게 말해보세요</Title>
          <AdjustInput
            value={originValue}
            placeholder="성산일출봉"
            additionalText="에서"
            onFocus={onOriginFocus}
            onChange={onOriginChange}
          />
          <AdjustInput
            value={destinationValue}
            placeholder="제주시청"
            additionalText="까지"
            onFocus={onDestinationFocus}
            onChange={onDestinationChange}
          />
          <AdjustInput
            value={stopsValue}
            placeholder="5"
            additionalText="정거장 전에 알려줘"
            onFocus={onStopsFocus}
            onChange={onStopsChange}
          />
          <MicButton isListening={isListening} onClick={onMicClick} />
        </>
      )}
    </VoiceInputContainer>
  );
};

export default VoiceInput;
