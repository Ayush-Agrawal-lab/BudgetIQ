// rrweb and network monitoring service
const MAX_EVENT_SIZE = 4096;

function serializeNetworkData(data) {
    if (!data) return "{}";
    
    try {
        // Handle string data
        if (typeof data === "string") {
            try {
                // Check if it's already valid JSON
                JSON.parse(data);
                return data.slice(0, MAX_EVENT_SIZE);
            } catch {
                // If not valid JSON, stringify it
                return JSON.stringify(data.slice(0, MAX_EVENT_SIZE));
            }
        }

        // Handle FormData
        if (data instanceof FormData) {
            const entries = {};
            for (const [key, value] of data.entries()) {
                entries[key] = typeof value === "string" ? value : "[File]";
            }
            return JSON.stringify(entries);
        }

        // Handle binary data
        if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
            return JSON.stringify(`[Binary data: ${data.byteLength} bytes]`);
        }

        // Handle null/undefined
        if (data === null || data === undefined) {
            return "{}";
        }

        // Handle objects and other types
        const stringified = JSON.stringify(data);
        return stringified.slice(0, MAX_EVENT_SIZE);
    } catch (e) {
        console.warn('Data serialization error:', e);
        return JSON.stringify({
            error: "Serialization failed",
            type: typeof data,
            summary: String(data).slice(0, 100)
        });
    }
}

export function emitNetworkEvent(eventData) {
    // Early return if rrweb is not available
    if (!window.__rr || typeof window.__rr.addCustomEvent !== 'function') {
        return;
    }

    try {
        // Create safe event data with defaults
        const safeEventData = {
            phase: 'unknown',
            api: 'axios',
            url: '',
            method: 'GET',
            timestamp: Date.now(),
            status: 0,
            statusText: '',
            headers: {},
            requestBody: {},
            responseBody: {},
            ...(eventData || {})
        };

        // Create the network event with serialized data
        const networkEvent = {
            ...safeEventData,
            headers: serializeNetworkData(safeEventData.headers),
            requestBody: serializeNetworkData(safeEventData.requestBody),
            responseBody: serializeNetworkData(safeEventData.responseBody)
        };

        // Emit the event
        window.__rr.addCustomEvent('network', networkEvent);
    } catch (error) {
        console.warn('Error emitting network event:', error);
    }
}

// Initialize rrweb recorder
export function initializeRRWeb() {
    if (typeof window.rrweb !== 'undefined') {
        try {
            const events = [];
            
            window.rrwebInstance = window.rrweb.record({
                emit(event) {
                    events.push(event);
                },
                recordCanvas: true,
                collectFonts: true,
                maskAllInputs: true,
                blockClass: 'do-not-record',
                maskInputOptions: { password: true },
                dataURLOptions: {
                    type: 'image/webp',
                    quality: 0.6
                }
            });

            // Store events in window.__rr for access
            window.__rr = {
                events,
                addCustomEvent: (tag, payload) => {
                    if (window.rrwebInstance) {
                        events.push({
                            type: 5, // Custom event type
                            data: { tag, payload },
                            timestamp: Date.now()
                        });
                    }
                }
            };

            console.log('RRWeb recording initialized successfully');
        } catch (error) {
            console.error('Error initializing RRWeb:', error);
        }
    } else {
        console.warn('RRWeb is not loaded. Session recording disabled.');
    }
}

// Add event listeners for errors and rejections
export function initializeErrorTracking() {
    window.addEventListener('error', (event) => {
        if (!window.__rr?.addCustomEvent) return;

        window.__rr.addCustomEvent('error', {
            type: 'runtime',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error ? {
                name: event.error.name,
                message: event.error.message,
                stack: event.error.stack
            } : null,
            timestamp: Date.now()
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        if (!window.__rr?.addCustomEvent) return;

        window.__rr.addCustomEvent('error', {
            type: 'promise',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
            timestamp: Date.now()
        });
    });
}