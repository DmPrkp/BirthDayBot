export interface TelegeramMessageBody {
    message_id: number,
    from: {},
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

