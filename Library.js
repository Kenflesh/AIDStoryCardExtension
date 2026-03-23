//Your other scripts should be here if they already exist. If not, delete everything and paste what's there.

// ============================================================================
// StoryCard Extension
// ============================================================================

const CONFIG_CARD_TITLE = "StoryCard Extension Config";
const DEFAULT_CONFIG = {
    randomCardChance: 0.15,
    randomEventChance: 0.1,
    useOnlyAutouseCards: true,
    eventDuration: 2,
    useEventWeights: true,
    currentEventTitle: "",
    currentEventDurationLeft: 0,
    alwaysIncludeCards: []
};

// ============================================================================
// AUXILIARY FUNCTIONS
// ============================================================================

function getCardText(card) {
    if (card.entry) return card.entry;
    if (card.value) return card.value;
    if (card.content) return card.content;
    if (card.description) return card.description;
    if (card.text) return card.text;
    if (card.keys && card.keys.entry) return card.keys.entry;
    return null;
}

function setCardText(card, newText) {
    if (card.entry !== undefined) {
        card.entry = newText;
    } else if (card.value !== undefined) {
        card.value = newText;
    } else if (card.content !== undefined) {
        card.content = newText;
    } else if (card.description !== undefined) {
        card.description = newText;
    } else if (card.text !== undefined) {
        card.text = newText;
    } else if (card.keys && card.keys.entry !== undefined) {
        card.keys.entry = newText;
    } else {
        card.entry = newText;
    }
}

function hasAutouseTrigger(card) {
    let keys = card.keys;
    if (!keys) return false;
    let triggerList = [];
    if (Array.isArray(keys)) {
        triggerList = keys;
    } else if (typeof keys === 'string') {
        triggerList = keys.split(/[ ,;]+/);
    }
    return triggerList.some(t => t.toLowerCase().trim() === 'autouse');
}

function isEventCard(card) {
    let cardType = card.type || (card.keys && card.keys.type);
    let customType = card.customType || (card.keys && card.keys.customType);
    if (cardType === 'Event') return true;
    if (cardType === 'Custom' && customType === 'Event') return true;
    if (card.keys && card.keys.type === 'Custom' && card.keys.customType === 'Event') return true;
    return false;
}

function getAllStoryCards() {
    if (typeof storyCards !== 'undefined' && storyCards && storyCards.length) return storyCards;
    if (typeof worldInfo !== 'undefined' && worldInfo && worldInfo.storyCards && worldInfo.storyCards.length) return worldInfo.storyCards;
    if (state && state.worldInfo && state.worldInfo.storyCards && state.worldInfo.storyCards.length) return state.worldInfo.storyCards;
    if (typeof window !== 'undefined' && window.storyCards && window.storyCards.length) return window.storyCards;
    return null;
}

function categorizeCards(allCards, useOnlyAutouse) {
    let eventCards = [];
    let regularCandidates = [];
    for (let card of allCards) {
        if (isEventCard(card)) {
            eventCards.push(card);
        } else {
            regularCandidates.push(card);
        }
    }
    let regularCards = useOnlyAutouse
        ? regularCandidates.filter(card => hasAutouseTrigger(card))
        : regularCandidates;
    return { eventCards, regularCards };
}

function formatAlwaysCardsBlock(cards) {
    if (!cards || cards.length === 0) return null;
    let entries = [];
    for (let card of cards) {
        let title = card.title || (card.keys && card.keys.title) || 'Unknown';
        let content = getCardText(card);
        if (content) {
            entries.push(`${title}: ${content};`);
        }
    }
    if (entries.length === 0) return null;
    return `[World Info:\n${entries.join('\n')}]`;
}

function formatRandomCard(card) {
    let title = card.title || (card.keys && card.keys.title) || 'Unknown';
    let content = getCardText(card);
    if (!content) return null;
    return `[Use the following information to enrich the story if it fits the current context:\n${title}. ${content}]`;
}

function formatEventCard(card) {
    let title = card.title || (card.keys && card.keys.title) || 'Unknown';
    let content = getCardText(card);
    if (!content) return null;
    return `[The following event may occur: ${title}. ${content}. Describe it if there are no contradictions.]`;
}

// ============================================================================
// CONFIG-CARD
// ============================================================================

function findConfigCard() {
    let allCards = getAllStoryCards();
    if (!allCards) return null;
    return allCards.find(card => {
        let title = card.title || (card.keys && card.keys.title);
        return title === CONFIG_CARD_TITLE;
    });
}

function readConfigFromCard(card) {
    let config = { ...DEFAULT_CONFIG };
    if (!card) return config;
    let content = getCardText(card);
    if (!content) return config;

    try {
        let parsed = JSON.parse(content);
        if (typeof parsed === 'object' && parsed !== null) {
            if (parsed.randomCardChance !== undefined) config.randomCardChance = parsed.randomCardChance;
            if (parsed.randomEventChance !== undefined) config.randomEventChance = parsed.randomEventChance;
            if (parsed.useOnlyAutouseCards !== undefined) config.useOnlyAutouseCards = parsed.useOnlyAutouseCards;
            if (parsed.eventDuration !== undefined) config.eventDuration = parsed.eventDuration;
            if (parsed.useEventWeights !== undefined) config.useEventWeights = parsed.useEventWeights;
            if (parsed.currentEventTitle !== undefined) config.currentEventTitle = parsed.currentEventTitle;
            if (parsed.currentEventDurationLeft !== undefined) config.currentEventDurationLeft = parsed.currentEventDurationLeft;
            if (parsed.alwaysIncludeCards !== undefined) config.alwaysIncludeCards = parsed.alwaysIncludeCards;
            return config;
        }
    } catch(e) { /* not JSON */ }

    let lines = content.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.includes('=')) {
            let [key, value] = line.split('=', 2);
            key = key.trim();
            value = value.trim();
            if (key === 'randomCardChance') config.randomCardChance = parseFloat(value);
            if (key === 'randomEventChance') config.randomEventChance = parseFloat(value);
            if (key === 'useOnlyAutouseCards') config.useOnlyAutouseCards = (value.toLowerCase() === 'true');
            if (key === 'eventDuration') config.eventDuration = parseInt(value, 10);
            if (key === 'useEventWeights') config.useEventWeights = (value.toLowerCase() === 'true');
            if (key === 'currentEventTitle') config.currentEventTitle = value;
            if (key === 'currentEventDurationLeft') config.currentEventDurationLeft = parseInt(value, 10);
            if (key === 'alwaysIncludeCards') {
                let names = value.split(/[ ,;]+/).filter(s => s.length > 0);
                config.alwaysIncludeCards = names;
            }
        }
    }
    return config;
}

function writeConfigToCard(card, config) {
    if (!card) return;
    let toSave = {
        randomCardChance: config.randomCardChance,
        randomEventChance: config.randomEventChance,
        useOnlyAutouseCards: config.useOnlyAutouseCards,
        eventDuration: config.eventDuration,
        useEventWeights: config.useEventWeights,
        currentEventTitle: config.currentEventTitle,
        currentEventDurationLeft: config.currentEventDurationLeft,
        alwaysIncludeCards: config.alwaysIncludeCards
    };
    let newContent = JSON.stringify(toSave, null, 2);
    setCardText(card, newContent);
}

function ensureConfigCard() {
    let existing = findConfigCard();
    if (existing) return existing;

    let newCard = {
        title: CONFIG_CARD_TITLE,
        entry: JSON.stringify(DEFAULT_CONFIG, null, 2),
        keys: "",
        type: "Custom",
        customType: "Config"
    };

    if (typeof storyCards !== 'undefined' && storyCards) {
        storyCards.push(newCard);
    } else if (typeof worldInfo !== 'undefined' && worldInfo && worldInfo.storyCards) {
        worldInfo.storyCards.push(newCard);
    } else if (state && state.worldInfo && state.worldInfo.storyCards) {
        state.worldInfo.storyCards.push(newCard);
    } else {
        state.message = `[StoryCard Extension] Failed to create config card. Please create one manually with the name "${CONFIG_CARD_TITLE}" and settings in JSON format.`;
    }
    return newCard;
}

// ============================================================================
// FUNCTIONS FOR WEIGHTED CHOICE & CUSTOM DURATION
// ============================================================================

function getEventWeight(card) {
    let keys = card.keys;
    if (!keys) return 1;

    let triggerList = [];
    if (Array.isArray(keys)) {
        triggerList = keys;
    } else if (typeof keys === 'string') {
        triggerList = keys.split(/[ ,;]+/);
    }

    for (let token of triggerList) {
        let match = token.match(/^weight=([\d.]+)$/i);
        if (match) {
            let w = parseFloat(match[1]);
            return isNaN(w) ? 1 : Math.max(0, w);
        }
    }
    return 1;
}

function getEventDuration(card, globalDuration) {
    let keys = card.keys;
    if (!keys) return globalDuration;

    let triggerList = [];
    if (Array.isArray(keys)) {
        triggerList = keys;
    } else if (typeof keys === 'string') {
        triggerList = keys.split(/[ ,;]+/);
    }

    for (let token of triggerList) {
        let match = token.match(/^duration=(\d+)$/i);
        if (match) {
            let d = parseInt(match[1], 10);
            return isNaN(d) ? globalDuration : Math.max(1, d);
        }
    }
    return globalDuration;
}

function selectEventByWeight(events) {
    if (!events || events.length === 0) return null;

    let weights = events.map(e => getEventWeight(e));
    let totalWeight = weights.reduce((a,b) => a+b, 0);
    if (totalWeight <= 0) return null;

    let rand = Math.random() * totalWeight;
    let accum = 0;
    for (let i = 0; i < events.length; i++) {
        accum += weights[i];
        if (rand < accum) return events[i];
    }
    return events[events.length-1];
}

// ============================================================================
// BASIC SCRIPT LOGIC
// ============================================================================

function StoryCardExtensionContext(text) {
    let configCard = ensureConfigCard();
    let config = readConfigFromCard(configCard);

    let allCards = getAllStoryCards();
    if (!allCards || allCards.length === 0) return text;

    let { eventCards, regularCards } = categorizeCards(allCards, config.useOnlyAutouseCards);

    let alwaysBlock = null;
    if (config.alwaysIncludeCards && config.alwaysIncludeCards.length > 0) {
        let cardMap = new Map();
        for (let card of allCards) {
            let title = card.title || (card.keys && card.keys.title);
            if (title) cardMap.set(title, card);
        }
        let foundCards = [];
        for (let name of config.alwaysIncludeCards) {
            let card = cardMap.get(name);
            if (card) foundCards.push(card);
        }
        alwaysBlock = formatAlwaysCardsBlock(foundCards);
    }

    if (typeof info !== 'undefined' && info.lastOutput !== undefined) {
        if (state.lastOutput === undefined) {
            state.lastOutput = info.lastOutput;
        }
        const isRetry = (info.lastOutput === state.lastOutput);
        state.lastOutput = info.lastOutput;
        state.isRetry = isRetry;
    } else {
        if (typeof info !== 'undefined' && info.actionCount !== undefined) {
            if (state.lastActionCount === undefined) {
                state.lastActionCount = info.actionCount;
            }
            const isRetry = (info.actionCount === state.lastActionCount);
            state.lastActionCount = info.actionCount;
            state.isRetry = isRetry;
        } else {
            state.isRetry = false;
        }
    }

    if (state.currentEvent === undefined) {
        state.currentEvent = {
            text: null,
            title: null,
            duration: 0
        };
    }

    let configEventTitle = config.currentEventTitle || "";
    let configEventDurationLeft = config.currentEventDurationLeft || 0;
    let currentTitle = state.currentEvent.title || "";

    if (configEventTitle === "" && state.currentEvent.duration > 0) {
        state.currentEvent = { text: null, title: null, duration: 0 };
        config.currentEventTitle = "";
        config.currentEventDurationLeft = 0;
        writeConfigToCard(configCard, config);
    }
    else if (configEventDurationLeft === 0 && state.currentEvent.duration > 0) {
        state.currentEvent = { text: null, title: null, duration: 0 };
        config.currentEventTitle = "";
        config.currentEventDurationLeft = 0;
        writeConfigToCard(configCard, config);
    }
    else if (configEventTitle !== "" && (configEventTitle !== currentTitle || configEventDurationLeft !== state.currentEvent.duration)) {
        if (configEventTitle !== currentTitle) {
            let foundEvent = eventCards.find(c => {
                let title = c.title || (c.keys && c.keys.title);
                return title === configEventTitle;
            });
            if (foundEvent) {
                state.currentEvent.text = formatEventCard(foundEvent);
                state.currentEvent.title = configEventTitle;
                state.currentEvent.duration = configEventDurationLeft;
            } else {
                state.currentEvent = { text: null, title: null, duration: 0 };
                config.currentEventTitle = "";
                config.currentEventDurationLeft = 0;
                writeConfigToCard(configCard, config);
            }
        } else if (configEventDurationLeft !== state.currentEvent.duration) {
            state.currentEvent.duration = configEventDurationLeft;
        }
    }

    if (state.currentEvent.duration === 0 && state.currentEvent.title !== null) {
        state.currentEvent.text = null;
        state.currentEvent.title = null;
        config.currentEventTitle = "";
        config.currentEventDurationLeft = 0;
        writeConfigToCard(configCard, config);
    }

    let newText = text;

    if (alwaysBlock) {
        newText = alwaysBlock + '\n\n' + newText;
    }
    if (regularCards.length > 0 && Math.random() < config.randomCardChance) {
        const randomIndex = Math.floor(Math.random() * regularCards.length);
        const card = regularCards[randomIndex];
        const cardBlock = formatRandomCard(card);
        if (cardBlock) {
            newText = cardBlock + '\n\n' + newText;
        }
    }

    // Обработка активного события
    if (state.currentEvent.duration > 0) {
        if (state.currentEvent.text) {
            newText = newText + '\n\n' + state.currentEvent.text;
        }
        if (!state.isRetry) {
            state.currentEvent.duration--;
            if (state.currentEvent.duration === 0) {
                state.currentEvent.text = null;
                state.currentEvent.title = null;
                config.currentEventTitle = "";
                config.currentEventDurationLeft = 0;
                writeConfigToCard(configCard, config);
            } else {
                config.currentEventDurationLeft = state.currentEvent.duration;
                writeConfigToCard(configCard, config);
            }
        }
    } else {
        if (eventCards.length > 0 && Math.random() < config.randomEventChance) {
            let selectedCard = null;
            if (config.useEventWeights) {
                selectedCard = selectEventByWeight(eventCards);
            } else {
                const randomIndex = Math.floor(Math.random() * eventCards.length);
                selectedCard = eventCards[randomIndex];
            }
            if (selectedCard) {
                const eventBlock = formatEventCard(selectedCard);
                if (eventBlock) {
                    let title = selectedCard.title || (selectedCard.keys && selectedCard.keys.title) || 'Unknown';
                    let duration = getEventDuration(selectedCard, config.eventDuration);
                    state.currentEvent = {
                        text: eventBlock,
                        title: title,
                        duration: duration
                    };
                    config.currentEventTitle = title;
                    config.currentEventDurationLeft = duration;
                    writeConfigToCard(configCard, config);
                    newText = newText + '\n\n' + eventBlock;
                }
            }
        }
    }

    return newText;
}

//Other library scripts