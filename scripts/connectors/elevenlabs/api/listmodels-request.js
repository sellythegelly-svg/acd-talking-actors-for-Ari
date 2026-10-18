import { ElevenlabsRequest } from "./elevenlabs-request.js";

export class ListModelsRequest extends ElevenlabsRequest {
    constructor(connector) {
        super(connector);
    }

    async fetch() {
        return [
            { model_id: "elevenlabs/eleven-v4-turbo", name: "ElevenLabs v4 Turbo (Baja latencia)" },
            { model_id: "elevenlabs/eleven-v4", name: "ElevenLabs v4 (Máxima calidad)" },
            { model_id: "elevenlabs/eleven-flash-v2.5", name: "ElevenLabs Flash v2.5 (Ultra rápido)" }
        ];
    }
}
