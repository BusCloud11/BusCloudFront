import { useCallback, useEffect, useState } from "react";

import axios from "axios";

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

type BusInfoType = {
  infoState: "notFound" | "error" | "normal";
  routeNumber: string; // 노선 번호
  predictionTime: number; // 현재 정류장까지 도착 예정 시간 (분)
  remainStation: number; // 현재 정류장까지 남은 정류장 수
  plateNumber: string; // 버스 차량번호 (아래 달려 있는 판넬)
};

/**
 * @param ms 얼마나 자주 갱신할지
 * @param stationId 정류장 id
 * @param routeId 노선 id
 * @returns
 */
export const useObserveStationContinuous = (
  ms: number,
  stationId: string,
  routeId: string
) => {
  const [busInfo, setBusInfo] = useState<BusInfoType>(NOT_FOUND_BUS_INFO);
  const [alarm, setAlarm] = useState(0);

  const getStationInfo = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://bus.jeju.go.kr/api/searchArrivalInfoList.do?",
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
        (busInfo: BusInfoType) => busInfo.routeNumber === routeId
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
  }, [stationId, routeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (alarm === 0) {
        getStationInfo();
        setAlarm(ms);
      } else setAlarm(alarm - 1000);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [alarm, getStationInfo, ms]);

  return {
    busInfo,
  };
};
