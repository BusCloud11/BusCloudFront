import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";

import { AdjustInput } from "./AdjustInput";
import Button from "../components/Button";
import Checkbox from "./CheckBox";
import { PostBusSaveResponseType } from "../utils/post-bus-save";
import icClose from "../assets/icClose.svg";
import icMic from "../assets/icMic.svg";
import icPlus from "../assets/icPlus.svg";
import { postBusFavorite } from "../utils/post-bus-favorite";

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
  onResetClick?: () => void;
  onConfirmClick: () => Promise<PostBusSaveResponseType | null>;
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
  padding: ${(props) => (props.isOpen ? "72px 24px 40px 24px" : "16px")};
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
  background-color: ${(props) => props.theme.colors.orange03};
  border: none;
  cursor: pointer;
  margin: 48px auto 40px auto;

  img {
    width: 44px;
    height: 44px;
  }
`;

const loadingAnimation = keyframes`
  0%     { background-position: calc(0 * 100% / 2) 50%, calc(1 * 100% / 2) 50%, calc(2 * 100% / 2) 50%; }
  33.33% { background-position: calc(0 * 100% / 2) 0%, calc(1 * 100% / 2) 50%, calc(2 * 100% / 2) 50%; }
  66.67% { background-position: calc(0 * 100% / 2) 50%, calc(1 * 100% / 2) 0%, calc(2 * 100% / 2) 50%; }
  100%   { background-position: calc(0 * 100% / 2) 50%, calc(1 * 100% / 2) 50%, calc(2 * 100% / 2) 0%; }
`;

const Loader = styled.div`
  width: 80%;
  height: 30px;
  aspect-ratio: 2.5;
  --_g: no-repeat radial-gradient(farthest-side, white 90%, #0000);
  background: var(--_g), var(--_g), var(--_g);
  background-size: 27% 50%;
  animation: ${loadingAnimation} 1s infinite linear;
`;

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <MicButtonContainer isListening={isListening} onClick={onClick}>
      {isListening ? <Loader /> : <img src={icMic} alt="Mic" />}
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

const BtnGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const H1 = styled.h1<{ isError: boolean }>`
  font-size: ${(props) => props.theme.text.h1md32.fontSize};
  font-weight: ${(props) => props.theme.text.h1md32.fontWeight};
  line-height: ${(props) => props.theme.text.h1md32.lineHeight};
  color: ${(props) =>
    props.isError ? props.theme.colors.redStrong : props.theme.colors.gray900};
  text-align: left;
`;

const CheckArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  font-size: ${(props) => props.theme.text.t1md20.fontSize};
  font-weight: ${(props) => props.theme.text.t1md20.fontWeight};
  line-height: ${(props) => props.theme.text.t1md20.lineHeight};
  padding-top: 16px;
  padding-bottom: 16px;

  span {
    text-align: left;
    color: ${(props) => props.theme.colors.gray600};
  }
`;

type StatusType = "closed" | "idle" | "listening" | "ready" | "done" | "error";

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
  onResetClick,
  onConfirmClick,
  isListening,
}: VoiceInputProps) => {
  const [status, setStatus] = useState<StatusType>("closed");
  const [isFavorite, setIsFavorite] = useState(false);
  const [response, setResponse] = useState<PostBusSaveResponseType | null>(
    null
  );

  useEffect(() => {
    const originInput = document.getElementById("originInput");
    if (status === "idle" && originInput) {
      originInput.focus();
    }
  }, [status]);

  const onConfirm = async () => {
    const res = await onConfirmClick();
    if (!response) {
      setStatus("error");
    } else {
      setResponse(res);
      setStatus("done");
    }
  };

  return (
    <VoiceInputContainer isOpen={status !== "closed"}>
      {status === "closed" ? (
        <ClosedBox
          onClick={() => {
            setStatus("idle");
          }}
        />
      ) : status === "done" ? (
        <>
          <CloseButton
            onClick={() => {
              setStatus("closed");
            }}
          />
          <H1 isError={false}>
            전화 예약 알림이
            <br />
            완료되었습니다.
          </H1>
          <CheckArea>
            <Checkbox
              checked={isFavorite}
              onToggle={() => {
                setIsFavorite((prev) => !prev);
              }}
            />
            <span>즐겨찾기에 추가할까요?</span>
          </CheckArea>
          <Button
            size="large"
            variant="secondary"
            onClick={async () => {
              if (!response) return;
              await postBusFavorite({ id: response.id, favorite: isFavorite });
              setStatus("closed");
            }}
          >
            확인
          </Button>
        </>
      ) : status === "error" ? (
        <>
          <CloseButton
            onClick={() => {
              setStatus("closed");
            }}
          />
          <H1 isError={true}>
            전화 예약 알림이
            <br />
            불가능합니다.
          </H1>
          <CheckArea>
            <span>
              요청하신 경로에 이용 가능한 버스 노선이 없습니다. 다른 수단을
              이용해주세요.
            </span>
          </CheckArea>
          <Button
            size="large"
            variant="secondary"
            onClick={() => {
              setStatus("closed");
            }}
          >
            확인
          </Button>
        </>
      ) : (
        <>
          <CloseButton
            onClick={() => {
              setStatus("closed");
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
          <BtnGroup>
            <Button size="small" variant="tertiary" onClick={onResetClick}>
              초기화
            </Button>
            <Button
              size="medium"
              variant="secondary"
              onClick={onConfirm}
              disabled={
                originValue === "" ||
                destinationValue === "" ||
                stopsValue === ""
              }
            >
              확인
            </Button>
          </BtnGroup>
        </>
      )}
    </VoiceInputContainer>
  );
};

export default VoiceInput;

const ClosedBox = ({ onClick }: { onClick: () => void }) => {
  return (
    <AddBox onClick={onClick}>
      <img src={icPlus} />
      <span>새 알림 등록하기</span>
    </AddBox>
  );
};
