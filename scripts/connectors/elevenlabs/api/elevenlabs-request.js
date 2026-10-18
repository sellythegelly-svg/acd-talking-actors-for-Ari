import { ELEVENLABS_CONSTANTS } from "../constants.js";

export class ElevenlabsRequest {
    api_key;
    api_url = 'https://openrouter.ai/api/v1/';
    connector;

    constructor(connector) {
        this.connector = connector;
        if (connector && typeof connector.getApiKey === "function") {
            this.api_key = connector.getApiKey();
        } else {
            try {
                this.api_key = game.settings.get(connector.mainSettingsId, ELEVENLABS_CONSTANTS.APIKEY);
            } catch(e) {}
            if (!this.api_key || this.api_key.length < 1) {
                try {
                    this.api_key = game.settings.get(connector.mainSettingsId, ELEVENLABS_CONSTANTS.MASTERAPIKEY);
                } catch(e) {}
            }
        }
    }

    execute() {
        throw new Error("Method 'execute()' ist not implemented in derived class.");
    };

    fetch() {
        throw new Error("Method 'fetch()' ist not implemented in derived class.");
    };

    async fetchJson(command) {
        const response = await fetch(`${this.api_url}${command}`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            }
        });

        this.checkResponseStatus(response);
    
        return await response.text();
    };

    async fetchResponse(command) {
        const response = await fetch(`${this.api_url}${command}`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            }
        });

        this.checkResponseStatus(response);
        
        return response;
    }

    async postData(command, acceptType, body) {
        let response = await fetch(`${this.api_url}${command}`, {
            method: 'POST',
            headers: {
                'accept': acceptType,
                'Authorization': `Bearer ${this.api_key}`,
                'Content-Type': 'application/json'
            },
            body: body
        });

        this.checkResponseStatus(response);

        return response;
    }

    checkResponseStatus(response) {
        if (response.status !== 200 && response.status !== 201) {
            console.error(`TTS request failed with status ${response.status}`);
            if (this.connector) {
                this.connector._speaking = false;
            }
            return false;
        }
        return true;
    }
}
