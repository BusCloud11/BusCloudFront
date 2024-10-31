import TMapPublicTransport from "../mocks/t-map-public.mock.json"

type GeoXYType = {
  x: number // 경도
  y: number // 위도
}
type BusRouteType = {
  routeNum: string // 노선 번호
  sStationId: string // 출발 정류장 ID
  sStationName: string // 출발 정류장 이름
}

export async function getBusRoute(startXY: GeoXYType, endXY: GeoXYType) {
  /** 실제 api 호출 */
  // const response = await axios.post(`https://apis.openapi.sk.com/transit/routes`, {
  //   startX: startXY.x, // 출발 경로
  //   startY: startXY.y, // 출발 위도
  //   endX: endXY.x, // 도착 경도
  //   endY: endXY.y, // 도착 위도
  //   count: 10, // 최대 경로 수
  //   format: 'json' // 반환 포멧
  
  // }, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'appKey': 'PDcWQYHmbg0P7HqskRnk4iAHDWHv40OaqG2APoE3',
  //   }
  // })
  
  const responseData = TMapPublicTransport
  const itinerariesIncludingBus = responseData.metaData.plan.itineraries.filter(
    (itinerary) => {
      return itinerary.legs.filter((leg)=> leg.mode === "BUS").length > 0
    }
  )
  
  if (itinerariesIncludingBus.length === 0) {
    return null
  }

  const targetItinerary = itinerariesIncludingBus[0]
  const busInfo = targetItinerary.legs.filter((leg) => leg.mode === "BUS")

  const routeNum = busInfo[0].route!
  const sStationId = busInfo[0].passStopList!.stationList[0].stationID
  const sStationName = busInfo[0].passStopList!.stationList[0].stationName

  const answer: BusRouteType = {
    routeNum,
    sStationId,
    sStationName
  }
  
  return answer
}