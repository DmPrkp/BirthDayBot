import { TelegramResponseBody, TelegramOptions } from "../interface/telegramPlugin";
import httpFetchRequest from "./helpers";

async function telegramFetch(options: TelegramOptions) {
    let token = process.env.TELEGRAM_TOKEN
    if (!token) throw new Error('NO TOKEN')
    let { method, params } = options

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
        let body : TelegramResponseBody = JSON.parse(resp)
        return body
    } catch (err) {
        console.error(err);
        return null
    }
}

export default telegramFetch
