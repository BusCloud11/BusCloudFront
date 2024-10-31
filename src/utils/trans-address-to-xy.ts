import axios from "axios";

type GeoXYType = {
  x: number; // 경도
  y: number; // 위도
};

/** 위/경도 가까운 정류소 찾기 */
export async function transAddressToXY(
  address: string,
  isTest?: boolean
): Promise<GeoXYType> {
  const test1 = "AIzaSyCQMwISsLo";
  const test2 = "R2dJxe9nhLl9";
  const test3 = test1 + test2;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: test3,
        },
      }
    );

    const geo = response.data.results[0]?.geometry.location;
    return {
      x: Number(geo.lng),
      y: Number(geo.lat),
    };
  } catch (e) {
    console.error("OpenStreetMap API 요청 실패");
    console.error(e);
    if (isTest) {
      return { x: 126.4934, y: 33.5071 };
    }
    return { x: 126.528244, y: 33.512253 };
  }
}
