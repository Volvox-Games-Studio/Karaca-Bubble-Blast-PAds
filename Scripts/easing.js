export function outSine(t) {
    return Math.sin(t * (Math.PI / 2));
}

export function harmonicCirc(t) {
    return 2 * Math.sqrt(0.25 - Math.pow((t - 0.5), 2));
}
