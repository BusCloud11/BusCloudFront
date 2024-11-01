import Switch from "./Switch";
import icBusDisabled from "../assets/icBusDisabled.svg";
import icEndDisabled from "../assets/icEndDisabled.svg";
import icEndPin from "../assets/icEndPin.svg";
import icLine from "../assets/icLine.svg";
import icStartDisabled from "../assets/icStartDisabled.svg";
import icStartPin from "../assets/icStartPin.svg";
import icTrash from "../assets/icTrash.svg";
import styled from "styled-components";

interface CardProps {
  title: string;
  departure: string;
  destination: string;
  buses?: { busNumber: string; color: string; stops: number }[];
  alertTime?: string;
  alertStop?: number;
  isAlertEnabled?: boolean;
  onToggleAlert?: () => void;
  onDeleteAlert?: () => void;
}

const CardContainer = styled.div<{ isAlertEnabled: boolean }>`
  border-radius: 24px;
  padding: 20px;
  padding-bottom: 24px;
  width: 100%;
  background-color: ${(props) =>
    props.isAlertEnabled
      ? props.theme.colors.gray50
      : props.theme.colors.gray200};
  color: ${(props) =>
    props.isAlertEnabled
      ? props.theme.colors.gray950
      : props.theme.colors.gray500};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  font-size: ${(props) => props.theme.text.b2md22.fontSize};
  font-weight: ${(props) => props.theme.text.b2md22.fontWeight};

  img {
    cursor: pointer;
  }
`;

const LocationInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid ${(props) => props.theme.colors.gray200};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray200};

  & > img {
    display: block;
    position: absolute;
    width: 2px;
    height: 36px;
    transform: translate(8px, 20px);
  }

  span {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 30px;
    font-size: ${(props) => props.theme.text.t1rg20.fontSize};

    img {
      margin-right: 8px;
    }
  }
`;

const BusInfo = styled.div`
  display: flex;
  flex-direction: column;

  div {
    min-height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 0 0;
    font-size: ${(props) => props.theme.text.h2md24.fontSize};
    font-weight: ${(props) => props.theme.text.h2md24.fontWeight};

    .bus-number {
      display: flex;
      align-items: center;

      img,
      svg {
        margin-right: 8px;
      }
    }

    .bus-stops {
      font-weight: bold;
    }
  }
`;

const AlertInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: align-start;
  gap: 12px;
  font-size: ${(props) => props.theme.text.t2md18.fontSize};
  font-weight: ${(props) => props.theme.text.t2md18.fontWeight};
`;

const AlertArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-right: 16px;
`;

const Card = ({
  title,
  departure,
  destination,
  buses,
  alertTime,
  alertStop,
  isAlertEnabled = false,
  onToggleAlert,
  onDeleteAlert,
}: CardProps) => {
  return (
    <CardContainer isAlertEnabled={isAlertEnabled}>
      <Header>
        {title}
        {onDeleteAlert && <img src={icTrash} onClick={onDeleteAlert} />}
      </Header>

      <LocationInfo>
        <span>
          <img
            src={isAlertEnabled ? icStartPin : icStartDisabled}
            alt="Start Pin"
          />
          {departure}
        </span>
        <img src={icLine} />
        <span>
          <img src={isAlertEnabled ? icEndPin : icEndDisabled} alt="End Pin" />
          {destination}
        </span>
      </LocationInfo>

      {buses && (
        <BusInfo>
          {buses.map((bus, index) => (
            <div key={index}>
              <span className="bus-number">
                {isAlertEnabled ? (
                  <svg
                    width="24"
                    height="23"
                    viewBox="0 0 24 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.8335 20.3333H6.16683V21.5C6.16683 21.8094 6.04391 22.1062 5.82512 22.325C5.60633 22.5438 5.30958 22.6667 5.00016 22.6667H2.66683C2.35741 22.6667 2.06066 22.5438 1.84187 22.325C1.62308 22.1062 1.50016 21.8094 1.50016 21.5V11H0.333496V6.33333H1.50016V2.83333C1.50016 2.21449 1.746 1.621 2.18358 1.18342C2.62116 0.745833 3.21466 0.5 3.8335 0.5H20.1668C20.7857 0.5 21.3792 0.745833 21.8167 1.18342C22.2543 1.621 22.5002 2.21449 22.5002 2.83333V6.33333H23.6668V11H22.5002V21.5C22.5002 21.8094 22.3772 22.1062 22.1585 22.325C21.9397 22.5438 21.6429 22.6667 21.3335 22.6667H19.0002C18.6907 22.6667 18.394 22.5438 18.1752 22.325C17.9564 22.1062 17.8335 21.8094 17.8335 21.5V20.3333ZM3.8335 2.83333V11H20.1668V2.83333H3.8335ZM6.75016 18C7.21429 18 7.65941 17.8156 7.9876 17.4874C8.31579 17.1592 8.50016 16.7141 8.50016 16.25C8.50016 15.7859 8.31579 15.3408 7.9876 15.0126C7.65941 14.6844 7.21429 14.5 6.75016 14.5C6.28603 14.5 5.84091 14.6844 5.51273 15.0126C5.18454 15.3408 5.00016 15.7859 5.00016 16.25C5.00016 16.7141 5.18454 17.1592 5.51273 17.4874C5.84091 17.8156 6.28603 18 6.75016 18V18ZM17.2502 18C17.7143 18 18.1594 17.8156 18.4876 17.4874C18.8158 17.1592 19.0002 16.7141 19.0002 16.25C19.0002 15.7859 18.8158 15.3408 18.4876 15.0126C18.1594 14.6844 17.7143 14.5 17.2502 14.5C16.786 14.5 16.3409 14.6844 16.0127 15.0126C15.6845 15.3408 15.5002 15.7859 15.5002 16.25C15.5002 16.7141 15.6845 17.1592 16.0127 17.4874C16.3409 17.8156 16.786 18 17.2502 18Z"
                      fill={bus.color}
                    />
                  </svg>
                ) : (
                  <img src={icBusDisabled} alt="Bus" />
                )}
                {Number(bus.busNumber) < 0 ? "365" : bus.busNumber}
              </span>
              <span className="bus-stops">
                {Number(bus.busNumber) < 0 ? "2" : bus.stops}번째 전
              </span>
            </div>
          ))}
        </BusInfo>
      )}

      {alertTime && alertStop && (
        <AlertArea>
          <AlertInfo>
            <div>
              {alertTime.length < 8
                ? generateTimeRanges(alertTime, 3)[0]
                : alertTime}
            </div>
            <span>{alertStop} 정류장 전에 알림을 드립니다.</span>
          </AlertInfo>
          <Switch selected={isAlertEnabled} onToggle={onToggleAlert!} />
        </AlertArea>
      )}
    </CardContainer>
  );
};

export default Card;

function generateTimeRanges(startTime: string, interval: number) {
  const ranges = [];

  // 시작 시간을 시와 분으로 분리
  const [startHour, startMinute] = startTime.split(":").map(Number);

  // 현재 시간을 분 단위로 계산
  let currentTime = startHour * 60 + startMinute;

  // 하루는 1440분
  const DAY_MINUTES = 24 * 60;

  while (currentTime < DAY_MINUTES) {
    // 종료 시간을 계산
    let endTime = currentTime + interval * 60;

    // 종료 시간이 하루를 초과하지 않도록 조정
    if (endTime > DAY_MINUTES) {
      endTime = DAY_MINUTES;
    }

    // 현재 시간과 종료 시간을 "HH:MM" 형식으로 변환
    const formatTime = (minutes: number) => {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    };

    const range = `${formatTime(currentTime)} ~ ${formatTime(endTime)}`;
    ranges.push(range);

    // 다음 시작 시간을 설정
    currentTime = endTime;
  }

  return ranges;
}
