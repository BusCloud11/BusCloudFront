import { AxiosError } from "axios"
import axiosInstanceToBack from "../axios-instance"

export const postMemberLogin = async (phone: string) => {
  try {
    const response = await axiosInstanceToBack().post('/api/member/login', {
      phone
    })
    return response.data.result.data
  } catch (e) {
    if (e instanceof Error || e instanceof AxiosError)
      throw e
    else throw new Error("알 수 없는 에러")
  }
}