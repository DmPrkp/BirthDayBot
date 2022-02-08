export interface TelegramOptions {
    token: string,
    handler?: ([]) => void
}

export interface FromObject {
    id: number,
    is_bot: boolean,
    first_name: string,
    last_name: string,
    language_code: string
}

export interface TelegeramMessageBody {
    message_id: number,
    from: FromObject,
    chat: {},
    date: number,
    text: string
}

export interface TelegeramMessage {
    update_id: number,
    message: TelegeramMessageBody
}

export interface TelegeramResultArray extends Array<TelegeramMessage> {}

export interface TelegeramResponseBody {
    ok: boolean;
    result : TelegeramResultArray
}

