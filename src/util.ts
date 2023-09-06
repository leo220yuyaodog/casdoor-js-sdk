// generate random code_verifier
function generateCodeVerifier(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;

    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        codeVerifier += characters.charAt(randomIndex);
    }

    return codeVerifier;
}

// use RSA256 encode code_verifier
async function encodeCodeVerifier(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return base64UrlEncode(hashHex);
}

function base64UrlEncode(input: string): string {
    const base64 = btoa(input);
    const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64Url;
}

function getOrSaveCodeVerifier(): string {
    let codeVerifier = localStorage.getItem('code_verifier');
    if (codeVerifier === null) {
        codeVerifier = generateCodeVerifier();
        sessionStorage.setItem('code_verifier', codeVerifier);
    }
    return codeVerifier;
}

function clearCodeVerifier(): void {
    sessionStorage.removeItem('code_verifier');
}

function getOrSaveState(): string {
    const state = sessionStorage.getItem("casdoor-state");
    if (state !== null) {
        return state;
    } else {
        const state = Math.random().toString(36).slice(2);
        sessionStorage.setItem("casdoor-state", state);
        return state;
    }
}

function clearState() {
    sessionStorage.removeItem("casdoor-state");
}
