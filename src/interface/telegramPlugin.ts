export interface TelegramOptions {
    method: string
    params: {}
}

export interface FromObject {
    id: number,
    is_bot?: boolean,
    first_name: string,
    last_name: string,
    language_code: string
}

export interface TelegramMessageBody {
    message_id: number,
    from: FromObject,
    chat: {},
    date: number,
    text: string
}

export interface TelegramMessage {
    update_id: number,
    message?: TelegramMessageBody
}

export interface TelegramResultArray extends Array<TelegramMessage> {}

export interface TelegramResponseBody {
    ok: boolean;
    result?: TelegramResultArray
}

