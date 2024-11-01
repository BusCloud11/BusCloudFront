import axios from "axios";
import mockData from "../mocks/api.json";

export interface Root {
  metaData: MetaData;
}

export interface MetaData {
  plan: Plan;
}

export interface Plan {
  itineraries: Itinerary[];
}

export interface Itinerary {
  fare: Fare;
  legs: Leg[];
  totalDistance: number;
  totalTime: number;
  totalWalkDistance: number;
  totalWalkTime: number;
  transferCount: number;
}

export interface Fare {
  regular: Regular;
}

export interface Regular {
  currency: Currency;
  totalFare: number;
}

export interface Currency {
  symbol: string;
  currency: string;
  currencyCode: string;
}

export interface Leg {
  mode: string;
  sectionTime: number;
  distance: number;
  start: Start;
  end: End;
  steps?: Step[];
  route?: string;
  routeColor?: string;
  routeId?: string;
  passShape?: PassShape;
  passStopList?: PassStopList;
}

export interface Start {
  name: string;
  lat: number;
  lon: number;
}

export interface End {
  name: string;
  lat: number;
  lon: number;
}

export interface Step {
  streetName: string;
  distance: number;
  description: string;
  linestring: string;
}

export interface PassShape {
  linestring: string;
}

export interface PassStopList {
  stationList: StationList[];
}

export interface StationList {
  index: number;
  stationID: string;
  stationName: string;
  lat: string;
  lon: string;
}

type GeoXYType = {
  x: number; // 경도
  y: number; // 위도
};
type BusRouteType = {
  routeNum: string; // 노선 번호
  sStationId: string; // 출발 정류장 ID
  sStationName: string; // 출발 정류장 이름
};

export async function getBusRoute(startXY: GeoXYType, endXY: GeoXYType) {
  console.log(startXY, endXY);
  const test1 = "ZuadZ1pLbSbuo3rCHCz";
  const test2 = "q8xYAIm3GS216Szb7lYid";
  const test3 = test1 + test2;

  /** 실제 api 호출 */
  // const response = await axios.post(
  //   `https://apis.openapi.sk.com/transit/routes`,
  //   {
  //     startX: startXY.x, // 출발 경로
  //     startY: startXY.y, // 출발 위도
  //     endX: endXY.x, // 도착 경도
  //     endY: endXY.y, // 도착 위도
  //     count: 10, // 최대 경로 수
  //     format: "json", // 반환 포멧
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       appKey: test3,
  //     },
  //   }
  // );

  // const responseData: Root = response.data;
  const responseData: Root = mockData;
  const itinerariesIncludingBus = responseData.metaData.plan.itineraries.filter(
    (itinerary) => {
      return itinerary.legs.filter((leg) => leg.mode === "BUS").length > 0;
    }
  );

  if (itinerariesIncludingBus.length === 0) {
    return null;
  }

  const targetItinerary = itinerariesIncludingBus[0];
  const busInfo = targetItinerary.legs.filter((leg) => leg.mode === "BUS");

  const routeNum = busInfo[0].route!;
  const sStationId = busInfo[0].passStopList!.stationList[0].stationID;
  const sStationName = busInfo[0].passStopList!.stationList[0].stationName;

  const answer: BusRouteType = {
    routeNum,
    sStationId,
    sStationName,
  };

  return answer;
}
