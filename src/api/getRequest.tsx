import axios from "axios";
import { BASE_URL } from "../constants/urls";

type GetRquestProps<T> = {
    url: string,
    params: T,
}

export async function getRequest<ResponseData,GetRequestParams>(props: GetRquestProps<GetRequestParams>): Promise<ResponseData> {
    const {
        params,
        url,
    } = props;

    try {
        const response = await axios.get<ResponseData>(
            new URL(url, BASE_URL).toString(),
            { 
                params
            }
        );
        return response.data
    } catch (error) {
        throw error
    }
}