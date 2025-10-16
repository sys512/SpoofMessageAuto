/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";
import { Devs } from "@utils/constants";
import { addMessagePreSendListener, removeMessagePreSendListener } from "@api/MessageEvents";

// map pasted from https://onlinetools.com/unicode/spoof-unicode-text
const spoofMap: Record<string, string> = {
    a: 'а', c: 'с', e: 'е', i: 'і', j: 'ј', o: 'о', p: 'р', s: 'ѕ', x: 'х', y: 'у',
    A: 'А', B: 'В', C: 'С', E: 'Е', H: 'Н', I: 'І', K: 'Κ', M: 'М', N: 'Ν',
    O: 'О', P: 'Р', S: 'Ѕ', T: 'Т', X: 'Х', Y: 'Υ', Z: 'Ζ',
    "!": 'ǃ', ".": '․', ";": ';', ",": '‚', "-": '‐'
};

function spoofUnicode(text: string): string {
    const result = [...text].map(char => {
        const replacement = spoofMap[char];
        return replacement || char;
    }).join('');
    return result;
}

interface SpoofMessagePlugin {
    listener?: (channelId: string, message: { content: string | null }) => void;
}

export default definePlugin<SpoofMessagePlugin>({
    name: "SpoofMessage",
    description: "Automatically bypass content filtering in servers by replacing latin characters with Unicode homoglyphs in every message",
    authors: [{ name: "skidaim", id: BigInt("1043358658504962138") }, { name: "Trident", id: BigInt("1236937728487198772") }],

    start() {
        this.listener = (_: string, message: { content: string | null }) => {
            if (!message?.content) return;
            message.content = spoofUnicode(message.content);
        };
        addMessagePreSendListener(this.listener);
    },

    stop() {
        if (this.listener) removeMessagePreSendListener(this.listener);
    }
});
