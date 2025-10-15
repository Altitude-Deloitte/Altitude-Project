import { computed } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';

export interface ChatMessage {
    text: string;
    timestamp: Date;
    isUser: boolean;
    isLoading?: boolean;
}

export interface ChatPayload {
    collected: Record<string, any>;
    message: string;
}

export interface ChatResponse {
    content?: any;
    result?: any;
    campaign_type?: string;
    message?: string;
    error?: string;
    collected?: Record<string, any>;
    missing_fields?: string[];
    status?: string;
}

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    currentFileContent: string | null;
    currentUserMessage: string | null;
    lastResponse: ChatResponse | null;
    collectedData: Record<string, any>;
    missingFields: string[];
}

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    currentFileContent: null,
    currentUserMessage: null,
    lastResponse: null,
    collectedData: {},
    missingFields: [],
};

export const ChatStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ messages, isLoading }) => ({
        hasMessages: computed(() => messages().length > 0),
        isGenerating: computed(() => isLoading()),
        lastMessage: computed(() => {
            const msgs = messages();
            return msgs.length > 0 ? msgs[msgs.length - 1] : null;
        }),
    })),
    withMethods((store) => ({
        addMessage: (message: ChatMessage) => {
            patchState(store, {
                messages: [...store.messages(), message],
            });
        },
        updateLastMessage: (text: string, isLoading = false) => {
            const messages = store.messages();
            if (messages.length > 0) {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    text,
                    isLoading,
                };
                patchState(store, { messages: updatedMessages });
            }
        },
        setLoading: (isLoading: boolean) => {
            patchState(store, { isLoading });
        },
        setFileContent: (content: string | null) => {
            patchState(store, { currentFileContent: content });
        },
        setUserMessage: (message: string | null) => {
            patchState(store, { currentUserMessage: message });
        },
        setLastResponse: (response: ChatResponse) => {
            patchState(store, { lastResponse: response });

            // Update collected data if response has collected fields
            if (response.collected) {
                patchState(store, { collectedData: response.collected });
            }

            // Update missing fields if provided
            if (response.missing_fields) {
                patchState(store, { missingFields: response.missing_fields });
            }
        },
        updateCollectedData: (field: string, value: any) => {
            const currentCollected = store.collectedData();
            patchState(store, {
                collectedData: { ...currentCollected, [field]: value }
            });
        },
        setCollectedData: (data: Record<string, any>) => {
            patchState(store, { collectedData: data });
        },
        clearChat: () => {
            patchState(store, initialState);
        },
        resetCollectedData: () => {
            patchState(store, { collectedData: {}, missingFields: [] });
        },
        // Extract field values from user message and update collected data
        extractAndUpdateFields: (message: string, missingFields: string[]) => {
            const currentCollected = store.collectedData();
            const updatedCollected = { ...currentCollected };

            // Field extraction patterns
            const fieldPatterns: Record<string, RegExp[]> = {
                brand: [
                    /brand\s+(?:is|:)?\s*([a-zA-Z0-9]+\.com)/i,
                    /([a-zA-Z0-9]+\.com)/i,
                    /brand\s+(?:is|:)?\s*([a-zA-Z0-9\s]+)/i
                ],
                topic: [/topic\s+(?:is|:)?\s*(.+?)(?:\.|$)/i],
                tone: [/tone\s+(?:is|:)?\s*(\w+)/i, /(formal|informal|casual|professional|friendly)/i],
                purpose: [/purpose\s+(?:is|:)?\s*(.+?)(?:\.|$)/i],
                target_reader: [/target\s+(?:reader|audience)\s+(?:is|:)?\s*(.+?)(?:\.|$)/i, /(Gen\s+Alpha|Gen\s+Z|Millennials|Gen\s+X)/i],
                word_limit: [/word\s+limit\s+(?:is|:)?\s*(\d+)/i, /(\d+)\s+words/i],
                platform_campaign: [/platform\s+campaign\s+(?:is|:)?\s*(.+?)(?:\.|$)/i, /(brand campaign|social media|email)/i],
                use_case: [/use\s+case\s+(?:is|:)?\s*(.+?)(?:\.|$)/i, /(Email Campaign|Blog Campaign|Social Media)/i],
                image_details: [/image\s+details?\s+(?:is|:)?\s*(.+?)(?:\.|$)/i, /(AI generated|uploaded|custom)/i],
                image_description: [/image\s+description\s+(?:is|:)?\s*(.+?)(?:\.|$)/i]
            };

            // Try to extract each missing field from the message
            missingFields.forEach(field => {
                if (!updatedCollected[field] && fieldPatterns[field]) {
                    for (const pattern of fieldPatterns[field]) {
                        const match = message.match(pattern);
                        if (match && match[1]) {
                            updatedCollected[field] = match[1].trim();
                            break;
                        }
                    }
                }
            });

            patchState(store, { collectedData: updatedCollected });
            return updatedCollected;
        }
    }))
);