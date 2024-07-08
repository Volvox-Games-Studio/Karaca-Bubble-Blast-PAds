export function waitNextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(() => resolve());
    });
}

export function waitForSeconds(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}