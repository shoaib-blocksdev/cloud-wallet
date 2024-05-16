// src/context/connectWallet.ts
import React2, { createContext } from "react";
var ConnectWalletContext = createContext({
  address: "",
  client: void 0,
  wallet: void 0,
  login: (type) => {
    return type;
  },
  logout: () => {
    return false;
  }
});
function useWallet() {
  return React2.useContext(ConnectWalletContext);
}
var connectWallet_default = ConnectWalletContext;

// src/hooks/useConnectWallet.tsx
import Cookie from "js-cookie";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { toUtf8 } from "@cosmjs/encoding";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
var getClient = async (rpc, key = "") => {
  if (key.length > 0) {
    try {
      const privateKey = toUtf8(key);
      const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, "juno");
      const client = await SigningCosmWasmClient.connectWithSigner(
        rpc,
        wallet
      );
      return {
        wallet,
        client
      };
    } catch (e) {
      console.log("wallet connection failed", e);
      return void 0;
    }
  }
  return void 0;
};
var useConnectWallet = (config) => {
  const [address, setAddress] = useState("");
  const [client, setClient] = useState("");
  const [wallet, setWallet] = useState("");
  const count = useRef(0);
  const socket = io(config.backend_url, {
    transports: ["websocket"],
    withCredentials: true
  });
  useEffect(() => {
    socket.on("getTokenRes", (msg) => {
      if (msg.success && socket.id === msg.id) {
        getClient(config.rpc, msg.token).then((cli) => {
          setClient(cli.client);
          setWallet(cli.wallet);
        });
      }
    });
    socket.on("error", () => {
      console.log("socket disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  const getToken = () => {
    const cookie = Cookie.get("cookie");
    cookie && socket.id && socket.emit("getToken", { cookie, id: socket.id });
  };
  const initialize = () => {
    getToken();
    const address2 = Cookie.get("address");
    address2 && setAddress(address2);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (!client && count.current <= 7) {
        initialize();
        count.current += 1;
      }
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handler = (event) => {
      if (event.data.address) {
        setAddress(event.data.address);
        Cookie.set("cookie", event.data.cookie);
        Cookie.set("address", event.data.address);
        getToken();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);
  const login = (type) => {
    const namespace = {
      "sms": "/sms",
      "google": "/login/federated/google",
      "facebook": "/login/federated/facebook"
    }[type];
    console.log("REACT_APP_SOCKET_URL", namespace);
    const url = config.backend_url + namespace;
    const newWindow = window.open(url, "name", "height=600,width=600");
    newWindow?.postMessage(JSON.stringify({ obj: window }), "*");
    if (window.focus()) {
      newWindow?.focus();
    }
    return false;
  };
  const logout = () => {
    Cookie.set("cookie", "");
    Cookie.set("address", "");
    setAddress(void 0);
  };
  return { logout, address, client, login, wallet };
};
var useConnectWallet_default = useConnectWallet;

// src/providers/ConnectWalletProvider.tsx
function WalletProvider({ children, config }) {
  const { address, client, login, logout, wallet } = useConnectWallet_default(config);
  return /* @__PURE__ */ React.createElement(connectWallet_default.Provider, { value: { address, client, login, logout, wallet } }, children);
}
var ConnectWalletProvider_default = WalletProvider;

// src/components/LoginWithGoogle.tsx
import React3 from "react";
import classNames from "classnames";

// src/components/LoginWithGoogle.css
var LoginWithGoogle_default = {};

// src/components/LoginWithGoogle.tsx
var LoginWithGoogle = (props) => {
  return /* @__PURE__ */ React3.createElement("div", { ...props, className: classNames(LoginWithGoogle_default.googleBtn, props?.className) }, /* @__PURE__ */ React3.createElement("div", { className: classNames(LoginWithGoogle_default.googleIconWrapper, "wrapper") }, /* @__PURE__ */ React3.createElement(
    "img",
    {
      className: LoginWithGoogle_default.googleIcon,
      src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuODc1NjcgMTQuMjk0Nkw1LjEwOTg4IDE3LjE1MzRMMi4zMTA5MyAxNy4yMTI2QzEuNDc0NDYgMTUuNjYxMSAxIDEzLjg4NiAxIDExLjk5OTdDMSAxMC4xNzU2IDEuNDQzNjEgOC40NTU1MiAyLjIyOTk0IDYuOTQwOTJIMi4yMzA1NEw0LjcyMjM4IDcuMzk3NzZMNS44MTM5NiA5Ljg3NDY1QzUuNTg1NSAxMC41NDA3IDUuNDYwOTcgMTEuMjU1NyA1LjQ2MDk3IDExLjk5OTdDNS40NjEwNiAxMi44MDcyIDUuNjA3MzMgMTMuNTgwOCA1Ljg3NTY3IDE0LjI5NDZaIiBmaWxsPSIjRkJCQjAwIi8+CjxwYXRoIGQ9Ik0yMi44MDcyIDkuOTQ1MzFDMjIuOTMzNSAxMC42MTA3IDIyLjk5OTQgMTEuMjk3OSAyMi45OTk0IDEyLjAwMDNDMjIuOTk5NCAxMi43ODc4IDIyLjkxNjYgMTMuNTU2IDIyLjc1ODggMTQuMjk3QzIyLjIyMzQgMTYuODE4NSAyMC44MjQyIDE5LjAyMDMgMTguODg1OSAyMC41Nzg0TDE4Ljg4NTMgMjAuNTc3OEwxNS43NDY3IDIwLjQxNzdMMTUuMzAyNSAxNy42NDQ3QzE2LjU4ODYgMTYuODkwNCAxNy41OTM3IDE1LjcxIDE4LjEyMzIgMTQuMjk3SDEyLjI0MTJWOS45NDUzMUgxOC4yMDlIMjIuODA3MloiIGZpbGw9IiM1MThFRjgiLz4KPHBhdGggZD0iTTE4Ljg4NTUgMjAuNTc3NkwxOC44ODYxIDIwLjU3ODJDMTcuMDAxIDIyLjA5MzQgMTQuNjA2NCAyMyAxMS45OTk2IDIzQzcuODEwNTUgMjMgNC4xNjg0NyAyMC42NTg2IDIuMzEwNTUgMTcuMjEyOUw1Ljg3NTI4IDE0LjI5NDlDNi44MDQyMiAxNi43NzQxIDkuMTk1ODIgMTguNTM5IDExLjk5OTYgMTguNTM5QzEzLjIwNDggMTguNTM5IDE0LjMzMzggMTguMjEzMiAxNS4zMDI2IDE3LjY0NDVMMTguODg1NSAyMC41Nzc2WiIgZmlsbD0iIzI4QjQ0NiIvPgo8cGF0aCBkPSJNMTkuMDIwOCAzLjUzMjQxTDE1LjQ1NzMgNi40NDk4MUMxNC40NTQ2IDUuODIzMDcgMTMuMjY5NCA1LjQ2MTAyIDExLjk5OTYgNS40NjEwMkM5LjEzMjMgNS40NjEwMiA2LjY5NTk3IDcuMzA2ODMgNS44MTM1NiA5Ljg3NDk0TDIuMjMwMDkgNi45NDEyMUgyLjIyOTQ5QzQuMDYwMjIgMy40MTE1NCA3Ljc0ODIzIDEgMTEuOTk5NiAxQzE0LjY2ODYgMSAxNy4xMTU4IDEuOTUwNzMgMTkuMDIwOCAzLjUzMjQxWiIgZmlsbD0iI0YxNDMzNiIvPgo8L3N2Zz4K"
    }
  )), /* @__PURE__ */ React3.createElement("div", { className: LoginWithGoogle_default.text }, /* @__PURE__ */ React3.createElement("p", { className: LoginWithGoogle_default.btnText }, /* @__PURE__ */ React3.createElement("b", null, "Continue with Google"))));
};
var LoginWithGoogle_default2 = LoginWithGoogle;

// src/components/LoginWithFB.tsx
import classNames2 from "classnames";
import React4 from "react";
var LoginWithFB = (props) => {
  return /* @__PURE__ */ React4.createElement("div", { ...props, className: classNames2(LoginWithGoogle_default.googleBtn, props?.className) }, /* @__PURE__ */ React4.createElement("div", { className: LoginWithGoogle_default.googleIconWrapper }, /* @__PURE__ */ React4.createElement("img", { className: LoginWithGoogle_default.googleIcon, src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDEyQzI0IDE3Ljk4OTcgMTkuNjExNiAyMi45NTQyIDEzLjg3NSAyMy44NTQyVjE1LjQ2ODhIMTYuNjcxMUwxNy4yMDMxIDEySDEzLjg3NVY5Ljc0OTA2QzEzLjg3NSA4Ljc5OTg0IDE0LjM0IDcuODc1IDE1LjgzMDYgNy44NzVIMTcuMzQzOFY0LjkyMTg4QzE3LjM0MzggNC45MjE4OCAxNS45NzAzIDQuNjg3NSAxNC42NTczIDQuNjg3NUMxMS45MTY2IDQuNjg3NSAxMC4xMjUgNi4zNDg3NSAxMC4xMjUgOS4zNTYyNVYxMkg3LjA3ODEyVjE1LjQ2ODhIMTAuMTI1VjIzLjg1NDJDNC4zODg0NCAyMi45NTQyIDAgMTcuOTg5NyAwIDEyQzAgNS4zNzI4MSA1LjM3MjgxIDAgMTIgMEMxOC42MjcyIDAgMjQgNS4zNzI4MSAyNCAxMloiIGZpbGw9IiMxODc3RjIiLz4KPHBhdGggZD0iTTE2LjY3MTEgMTUuNDY4OEwxNy4yMDMxIDEySDEzLjg3NVY5Ljc0OTAyQzEzLjg3NSA4LjgwMDAzIDE0LjMzOTkgNy44NzUgMTUuODMwNiA3Ljg3NUgxNy4zNDM4VjQuOTIxODhDMTcuMzQzOCA0LjkyMTg4IDE1Ljk3MDUgNC42ODc1IDE0LjY1NzYgNC42ODc1QzExLjkxNjUgNC42ODc1IDEwLjEyNSA2LjM0ODc1IDEwLjEyNSA5LjM1NjI1VjEySDcuMDc4MTJWMTUuNDY4OEgxMC4xMjVWMjMuODU0MkMxMC43MzYgMjMuOTUgMTEuMzYyMSAyNCAxMiAyNEMxMi42Mzc5IDI0IDEzLjI2NCAyMy45NSAxMy44NzUgMjMuODU0MlYxNS40Njg4SDE2LjY3MTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" })), /* @__PURE__ */ React4.createElement("div", { className: LoginWithGoogle_default.text }, /* @__PURE__ */ React4.createElement("p", { className: LoginWithGoogle_default.btnText }, /* @__PURE__ */ React4.createElement("b", null, "Continue with Facebook"))));
};
var LoginWithFB_default = LoginWithFB;
export {
  LoginWithFB_default as LoginWithFB,
  LoginWithGoogle_default2 as LoginWithGoogle,
  ConnectWalletProvider_default as WalletProvider,
  useWallet
};
