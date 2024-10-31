import axios from "axios";

type GeoXYType = {
  x: number // 경도
  y: number // 위도
}

/** 위/경도 가까운 정류소 찾기 */
export async function transAddressToXY(address: string): Promise<GeoXYType> {
  const googleMapKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: googleMapKey
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
