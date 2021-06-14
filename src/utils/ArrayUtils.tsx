export default class ArrayUtils {

    public static createBinaryCombinationsArray(n: number): number[][] {
        /* Utiliza de "manipulaçoes de bits" para criar o vetor, sem demais explanações.
           Exemplo saída [[00][01][10][11]] */
        const r = [];
        for(let i = 0; i < (1 << n); i++) {
            const c = [];
            for(let j = 0; j < n; j++) {
            c.push(i & (1 << j) ? 1 : 0);  
            }
            r.push(c);
        }
        return r;
    }

}