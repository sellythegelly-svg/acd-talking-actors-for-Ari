import { ElevenlabsRequest } from "./elevenlabs-request.js";

export class TextToSpeechRequest extends ElevenlabsRequest {
    voiceId;
    modelId;
    languageId;
    text;
    settings;

    constructor(connector, voiceId, modelId, languageId, text, settings) {
        super(connector);
        this.voiceId = voiceId;
        this.modelId = modelId;
        this.languageId = languageId;
        this.text = text;
        this.settings = settings;
    }

    async fetch() {
        let model = this.modelId || "elevenlabs/eleven-v4-turbo";
        if (!model.startsWith("elevenlabs/")) {
            model = `elevenlabs/${model.replace(/_/g, "-")}`;
        }

        let body = {
            "model": model,
            "input": this.text,
            "voice": this.voiceId || "sarah",
            "response_format": "mp3"
        };

        let response = await this.postData(
            `audio/speech`,
            "audio/mpeg",
            JSON.stringify(body)
        );
        return response;
    }
}
