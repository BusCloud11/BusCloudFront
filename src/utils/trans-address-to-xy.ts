import axios from "axios";

type GeoXYType = {
  x: number // 경도
  y: number // 위도
}

/** 위/경도 가까운 정류소 찾기 */
export async function transAddressToXY(address: string): Promise<GeoXYType> {
  try {
    const apiKey = "AIzaSyCQMwISsLoR2dJxe9nhLl9-wERXQ-Hryfo"; 

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: "AIzaSyD_1xj3GyH4h174VgfBY9FSg_NBRCVJ3L0"
      }
    });

    const geo = response.data.results[0]?.geometry.location;
    return {
      x: Number(geo.lng),
      y: Number(geo.lat)
    };

  } catch (e) {
    console.error("OpenStreetMap API 요청 실패")
    console.error(e)
    
    return { x: -1, y: -1 };
  } 
}