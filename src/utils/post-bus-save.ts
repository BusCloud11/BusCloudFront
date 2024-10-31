import { AxiosError } from "axios"
import axiosInstanceToBack from "../axios-instance"

type PostBusSaveRequestType = {
  departure: string
  destination: string
  station: number
  stationId: string
  notionId: string
  time: string
}
type PostBusSaveResponseType = {
  id: number
  departure: string
  destination: string
  station: number
  time: string
  notionId: string
  stationId: string
}

export const postBusSave = async (data: PostBusSaveRequestType) => {
  try {
    const response = await axiosInstanceToBack().post('/api/bus/save', data)
    return response.data.result as PostBusSaveResponseType
  } catch (e) {
    if (e instanceof Error || e instanceof AxiosError)
      throw e
    else throw new Error("알 수 없는 에러")
  }
}