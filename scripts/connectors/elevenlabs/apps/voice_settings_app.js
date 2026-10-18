import { ELEVENLABS_CONSTANTS, ELEVENLABS_FLAGS } from "../constants.js";

export class VoiceSettingsApp extends Application {

    static flag = "elevenlabs-voiceSettings";
    static moduleKey = "acd-talking-actors";

    constructor(connector, actors, options = {}) {
        super(options);

        this.opts = options;
        this.connector = connector;
        this.actors = Array.isArray(actors) ? actors : (actors ? [actors] : []);
        this.voices = connector.getAvailableVoices() || [];
        this.models = connector.getAvailableModels() || [];
        this.voiceId = this.getCurrentVoiceId();
        this.voiceSettings = this.getCurrentVoiceSettings();
        this.modelId = this.getCurrentVoiceModelId() || "elevenlabs/eleven-v4-turbo";
        this.currentModel = this.getCurrentVoiceModel() || {};
        this.languageId = this.getCurrentLanguageId() || "es";
    }

    getCurrentVoiceId() {
        if (!this.actors || this.actors.length === 0) return undefined;
        let voice_id = this.actors[0].flags?.[VoiceSettingsApp.moduleKey]?.[ELEVENLABS_FLAGS.VOICE_ID];
        return voice_id || (this.voices[0]?.voice_id || "sarah");
    }

    getCurrentVoiceModelId() {
        if (!this.actors || this.actors.length === 0) return "elevenlabs/eleven-v4-turbo";
        let voice_model_id = this.actors[0].flags?.[VoiceSettingsApp.moduleKey]?.[ELEVENLABS_FLAGS.VOICE_MODEL_ID] 
            || (this.connector.getDefaultModelId ? this.connector.getDefaultModelId() : "elevenlabs/eleven-v4-turbo");
        return voice_model_id;
    }

    getCurrentVoiceModel() {
        let voice_model_id = this.getCurrentVoiceModelId();
        let currentModel = (this.models || []).find(m => m.model_id === voice_model_id);
        return currentModel || this.models[0] || {
            model_id: "elevenlabs/eleven-v4-turbo",
            name: "ElevenLabs v4 Turbo",
            languages: [{ language_id: "es", name: "Spanish" }, { language_id: "en", name: "English" }]
        };
    }

    getCurrentLanguageId() {
        if (!this.actors || this.actors.length === 0) return "es";

        let currentModel = this.getCurrentVoiceModel();
        let defaultLang = this.connector.getDefaultLanguageId ? this.connector.getDefaultLanguageId() : "es";
        let language_id = this.actors[0].flags?.[VoiceSettingsApp.moduleKey]?.[ELEVENLABS_FLAGS.LANGUAGE_ID] || defaultLang;

        let languages = currentModel?.languages || [{ language_id: "es", name: "Spanish" }];
        let foundLanguage = languages.find(l => l.language_id === language_id);

        if (foundLanguage && foundLanguage.language_id) {
            return foundLanguage.language_id;
        }

        return languages[0]?.language_id || "es";
    }

    getCurrentVoiceSettings() {
        if (!this.actors || this.actors.length === 0) return { stability: 0.5, similarity_boost: 0.75, style: 0.0 };

        let settings = this.actors[0].flags?.[VoiceSettingsApp.moduleKey]?.[ELEVENLABS_FLAGS.VOICE_SETTINGS];
        if (!settings) {
            settings = { stability: 0.5, similarity_boost: 0.75, style: 0.0 };
            if (this.voiceId) {
                this.updateVoiceSettings();
            }
        }
        return settings;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "changeVoiceSettings",
            title: game.i18n.localize("acd.ta.VoiceSettings.Title") || "Voice Settings",
            template: ELEVENLABS_CONSTANTS.TEMPLATEDIR + "voice_settings.hbs",
            width: 800,
            popOut: true
        });
    }

    getData(options) {
        let currentSettings = this.getCurrentVoiceSettings();

        return {
            actors: this.actors,
            voices: this.voices,
            models: this.models,
            voiceId: this.getCurrentVoiceId(),
            modelId: this.getCurrentVoiceModelId(),
            currentModel: this.getCurrentVoiceModel(),
            languageId: this.getCurrentLanguageId(),
            voiceSettings: currentSettings,
            currentStability: currentSettings.stability ? Math.round(currentSettings.stability * 100) : 50,
            currentSimilarityBoost: currentSettings.similarity_boost ? Math.round(currentSettings.similarity_boost * 100) : 75,
            currentStyle: currentSettings.style ? Math.round(currentSettings.style * 100) : 0
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        var that = this;

        $('.items-header .item-controls', html).click($.proxy(this.changeActors, this));

        $('.item-list .item', html).each(function (elem) {
            $('.item-delete', this).click($.proxy(that.removeActor, that, this.dataset.itemId));
        });

        $('.dialog-button.accept-data', html).click(this.acceptData.bind(this));$('.dialog-button.close', html).click(this.close.bind(this));

        $('#voice-id', html).change($.proxy(async function (e) {
            that.voiceId = $(e.currentTarget).val();
            await that.updateVoiceSettings();
        }, this));

        $('#model-id', html).change($.proxy(async function (e) {
            that.modelId = $(e.currentTarget).val();
            that.currentModel = (that.models || []).find(m => m.model_id === that.modelId);
        }, this));

        $('#language-id', html).change($.proxy(async function (e) {
            that.languageId = $(e.currentTarget).val();
        }, this));

        $('#similarity_boost', html).change($.proxy(function (e) {
            that.voiceSettings.similarity_boost = $(e.currentTarget).val();
            that.setTextValue($('.ta-voice-settings #similarity_boost_label'), that.voiceSettings.similarity_boost);
        }, this));

        $('#stability', html).change($.proxy(function (e) {
            that.voiceSettings.stability = $(e.currentTarget).val();
            that.setTextValue($('.ta-voice-settings #stability_label'), that.voiceSettings.stability);
        }, this));

        $('#style', html).change($.proxy(function (e) {
            that.voiceSettings.style = $(e.currentTarget).val();
            that.setTextValue($('.ta-voice-settings #style_label'), that.voiceSettings.style);
        }, this));

        $('#play-sample', html).click($.proxy(this.playSample, this));
    }

    setTextValue(element, value) {
        element.text(Math.round(value * 100) + " %");
    }

    async updateVoiceSettings() {
        let settings = this.actors[0]?.flags?.[VoiceSettingsApp.moduleKey]?.[ELEVENLABS_FLAGS.VOICE_SETTINGS];

        if (settings != undefined && this.voiceId === this.getCurrentVoiceId()) {
            this.voiceSettings = settings;
        } else if (this.voiceId != undefined && game.acdTalkingActors?.ttsConnector) {
            this.voiceSettings = await game.acdTalkingActors.ttsConnector.getVoiceSettings(this.voiceId);
        }

        if (!this.voiceSettings) {
            this.voiceSettings = { stability: 0.5, similarity_boost: 0.75, style: 0.0 };
        }

        $('.ta-voice-settings #similarity_boost').val(this.voiceSettings.similarity_boost);
        this.setTextValue($('.ta-voice-settings #similarity_boost_label'), this.voiceSettings.similarity_boost);
        $('.ta-voice-settings #stability').val(this.voiceSettings.stability);
        this.setTextValue($('.ta-voice-settings #stability_label'), this.voiceSettings.stability);
        $('.ta-voice-settings #style').val(this.voiceSettings.style);
        this.setTextValue($('.ta-voice-settings #style_label'), this.voiceSettings.style);
    }

    async acceptData() {
        for (let actor of this.actors) {
            await actor.setFlag(VoiceSettingsApp.moduleKey, ELEVENLABS_FLAGS.VOICE_ID, this.voiceId);
            await actor.setFlag(VoiceSettingsApp.moduleKey, ELEVENLABS_FLAGS.VOICE_MODEL_ID, this.modelId);
            await actor.setFlag(VoiceSettingsApp.moduleKey, ELEVENLABS_FLAGS.LANGUAGE_ID, this.languageId);
            await actor.setFlag(VoiceSettingsApp.moduleKey, ELEVENLABS_FLAGS.VOICE_SETTINGS, this.voiceSettings);
        }
        this.close();
    }

    async playSample() {
        let voiceId = $('#voice-id').find(":selected").val() || this.voiceId;
        if (this.connector && typeof this.connector.playSample === "function") {
            this.connector.playSample(voiceId);
        }
    }

    changeActors(e) {
        let type = e.target.dataset.type;
        switch (type) {
            case 'actor':
                let linkedActors = canvas.tokens.controlled.filter(token => token.actor?.prototypeToken?.actorLink).map(x => x.actor);
                if (linkedActors.length == 0)
                    ui.notifications.error(game.i18n.localize("acd.ta.errors.noLinkedActor"));
                else
                    this.addActors(linkedActors);
                break;
            case 'clear':
                this.actors = [];
                this.render(true);
                break;
        }
    }

    removeActor(id) {
        let idx = this.actors.findIndex(t => t.id === id);
        if (idx > -1) {
            this.actors.splice(idx, 1);
        }
        $(`li[data-item-id="${id}"]`, this.element).remove();
        this.render(true);
        window.setTimeout(() => { this.setPosition({ height: 'auto' }); }, 100);
    }

    addActors(actors) {
        if (!Array.isArray(actors)) actors = [actors];

        let failed = [];
        actors = actors.filter(t => {
            if (this.actors.find(e => e.id === t.id || e._id === t._id)) {
                failed.push(t.name);
                return false;
            }
            return true;
        });

        if (failed.length > 0)
            ui.notifications.warn(game.i18n.localize("acd.ta.errors.tokensAlreadyAdded"));

        if (actors.length > 0)
            this.actors = this.actors.concat(actors);

        this.render(true);
        window.setTimeout(() => { this.setPosition({ height: 'auto' }); }, 100);
    }
}

window.VoiceSettingsApp = VoiceSettingsApp;
