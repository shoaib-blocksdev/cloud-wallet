import * as React from 'react';
import React__default, { ReactNode } from 'react';

declare function useWallet(): {
    address: string;
    client: undefined;
    wallet: undefined;
    login: (type: string) => string;
    logout: () => false;
};

type Config = {
    backend_url: string;
    rpc: string;
};

declare function WalletProvider({ children, config }: {
    children: ReactNode;
    config: Config;
}): React.JSX.Element;

declare const LoginWithGoogle: (props: any) => React__default.JSX.Element;

declare const LoginWithFB: (props: any) => React__default.JSX.Element;

export { LoginWithFB, LoginWithGoogle, WalletProvider, useWallet };
