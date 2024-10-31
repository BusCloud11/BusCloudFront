import { AxiosError } from "axios"
import axiosInstanceToBack from "../axios-instance"

type PostBusFavoriteRequestType = {
  id: number
  favorite?: boolean
}

export const postBusFavorite = async ({ id, favorite = false }: PostBusFavoriteRequestType) => {
  try {
    await axiosInstanceToBack().post('/api/bus/favorite', {
      id,
      favorite
    })
  } catch (e) {
    if (e instanceof Error || e instanceof AxiosError)
      throw e
    else throw new Error("알 수 없는 에러") 
  }
}