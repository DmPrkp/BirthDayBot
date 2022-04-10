import {TelegramMessage, TelegramResponseBody} from "../interface/telegramPlugin";
import telegramFetch from "../helpers/telegram-fetch";

let requestIterator = async (options, fastify) => {
    let reqOptions = {...options}
    let resp : TelegramResponseBody;
    try {
        resp = await telegramFetch(options)
        if (resp?.ok && resp?.result && resp?.result?.length) {
            await fastify.bot(resp.result)
        }
    } catch (err) {
        console.error(err);
    }

    let { result } = resp || {};
    let lastMessage : TelegramMessage
    if (result && result.length) {
        lastMessage = result.pop()
        lastMessage.update_id = lastMessage.update_id + 1
    } else {
        lastMessage = { update_id: options.params.offset }
    }
    reqOptions.params.offset = lastMessage.update_id
    return await requestIterator(reqOptions, fastify)
}

export default requestIterator