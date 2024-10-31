import { AxiosError } from "axios"
import axiosInstanceToBack from "../axios-instance"

type GetBusListResponseType = {
  id: number,
  departure: string,
  destination: string,
  station: number,
  time: string,
  alarm: boolean,
  favorite: false,
  notionId: number,
  stationId: number,
  frequency: number
}

export const getBusList = async () => {
  
  try {
    const response = await axiosInstanceToBack().get('/api/bus/list')

    return response.data.result.list as GetBusListResponseType[]
    
  }
  catch (e) {
    if (e instanceof Error || e instanceof AxiosError)
      throw e
    else throw new Error("알 수 없는 에러")
  }
}