import {TelegeramResponseBody, TelegramOptions} from "../interface/telegramPlugin";
import httpFetchRequest from "./helpers";

async function telegramFetch(options: TelegramOptions) {
    let token = process.env.TELEGRAMM_TOKEN
    let { method, params } = options
    // getUpdates
    // let reqParams =

    let requestOptions = {
        hostname: `api.telegram.org`,
        method: 'POST',
        port: 443,
        path: `/bot${token}/${method}`,
        // path: `/bot${token}/getFile`,
        // path: `/file/bot${token}/documents/file_0.png`,
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Length': reqParams.length
        }
    }

    try {
        let resp : any = await httpFetchRequest(requestOptions, params)
        let body : TelegeramResponseBody = JSON.parse(resp)
        return body
    } catch (err) {
        console.error(err);
        return null
    }
}

export default telegramFetch
