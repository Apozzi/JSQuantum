export default class ColorUtils {

    public static hsvToRgb(h: number, s: number, v: number) {
        let r = 0, g = 0, b = 0, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            /* eslint-disable */
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
            /* eslint-enable */
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    public static rgbToHexNumber(r: number, g: number, b: number) {
        return parseInt([r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''), 16);
    }

}