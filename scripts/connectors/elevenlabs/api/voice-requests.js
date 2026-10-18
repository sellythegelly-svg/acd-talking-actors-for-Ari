import { ElevenlabsRequest } from "./elevenlabs-request.js";

export class GetVoicesRequest extends ElevenlabsRequest {
    constructor(connector) {
        super(connector);
    }

    async fetch() {
        return [
            { voice_id: "sarah", name: "Sarah (Femenina - Suave)", category: "premade", labels: { gender: "female" } },
            { voice_id: "alice", name: "Alice (Femenina - Clara)", category: "premade", labels: { gender: "female" } },
            { voice_id: "jessica", name: "Jessica (Femenina - Expresiva)", category: "premade", labels: { gender: "female" } },
            { voice_id: "lily", name: "Lily (Femenina - Narradora)", category: "premade", labels: { gender: "female" } },
            { voice_id: "matilda", name: "Matilda (Femenina - Cálida)", category: "premade", labels: { gender: "female" } },
            { voice_id: "bella", name: "Bella (Femenina - Joven)", category: "premade", labels: { gender: "female" } },
            { voice_id: "laura", name: "Laura (Femenina - Dinámica)", category: "premade", labels: { gender: "female" } },
            { voice_id: "river", name: "River (Neutra / Calma)", category: "premade", labels: { gender: "neutral" } },
            { voice_id: "adam", name: "Adam (Masculina - Profunda)", category: "premade", labels: { gender: "male" } },
            { voice_id: "brian", name: "Brian (Masculina - Grave)", category: "premade", labels: { gender: "male" } },
            { voice_id: "callum", name: "Callum (Masculina - Rasposa)", category: "premade", labels: { gender: "male" } },
            { voice_id: "charlie", name: "Charlie (Masculina - Casual)", category: "premade", labels: { gender: "male" } },
            { voice_id: "chris", name: "Chris (Masculina - Natural)", category: "premade", labels: { gender: "male" } },
            { voice_id: "daniel", name: "Daniel (Masculina - Autoritaria)", category: "premade", labels: { gender: "male" } },
            { voice_id: "eric", name: "Eric (Masculina - Amigable)", category: "premade", labels: { gender: "male" } },
            { voice_id: "george", name: "George (Masculina - Madura)", category: "premade", labels: { gender: "male" } },
            { voice_id: "harry", name: "Harry (Masculina - Guerrera)", category: "premade", labels: { gender: "male" } },
            { voice_id: "liam", name: "Liam (Masculina - Joven)", category: "premade", labels: { gender: "male" } },
            { voice_id: "patrick", name: "Patrick (Masculina - Enérgica)", category: "premade", labels: { gender: "male" } },
            { voice_id: "roger", name: "Roger (Masculina - Clásica)", category: "premade", labels: { gender: "male" } },
            { voice_id: "will", name: "Will (Masculina - Suave)", category: "premade", labels: { gender: "male" } }
        ];
    }
}

export class GetVoiceSettingsRequest extends ElevenlabsRequest {
    voiceId;

    constructor(connector, voiceId) {
        super(connector);
        this.voiceId = voiceId;
    }

    async fetch() {
        return {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
        };
    }
}
