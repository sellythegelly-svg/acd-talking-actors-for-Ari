import { ElevenlabsRequest } from "./elevenlabs-request.js";

export class GetUserSubscriptionInfoRequest extends ElevenlabsRequest {
    constructor(connector) {
        super(connector);
    }

    async fetch() {
        return {
            tier: "openrouter",
            character_count: 0,
            character_limit: 9999999,
            can_extend_character_limit: true,
            allowed_to_extend_character_limit: true,
            status: "active"
        };
    }
}
