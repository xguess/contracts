declare module 'eth-sig-util' {
    type Data = { type: string, name: string, value: any }[];

    export function signTypedData(privateKey: Buffer, msgParams: { data: Data }): string;

    type Recover = {data: Data, sig: string};
    export function recoverTypedData(rec: Recover): string;
}

declare module 'leche' {
    const withData: (dataset: any, testFunction: any) => void;
}

declare module "chai-bignumber" {
    function chaiBignumber(bignumber?: any): (chai: any, utils: any) => void;

    namespace chaiBignumber {

    }

    export = chaiBignumber;
}

declare namespace Chai {
    // For BDD API
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        bignumber: Assertion;
    }
}
