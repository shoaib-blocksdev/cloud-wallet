"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  LoginWithFB: () => LoginWithFB_default,
  LoginWithGoogle: () => LoginWithGoogle_default2,
  WalletProvider: () => ConnectWalletProvider_default,
  useWallet: () => useWallet
});
module.exports = __toCommonJS(src_exports);

// src/context/connectWallet.ts
var import_react = __toESM(require("react"), 1);
var ConnectWalletContext = (0, import_react.createContext)({
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
  return import_react.default.useContext(ConnectWalletContext);
}
var connectWallet_default = ConnectWalletContext;

// src/hooks/useConnectWallet.tsx
var import_js_cookie = __toESM(require("js-cookie"), 1);
var import_react2 = require("react");
var import_socket = __toESM(require("socket.io-client"), 1);
var import_encoding = require("@cosmjs/encoding");
var import_proto_signing = require("@cosmjs/proto-signing");
var import_cosmwasm_stargate = require("@cosmjs/cosmwasm-stargate");
var getClient = async (rpc, key = "") => {
  if (key.length > 0) {
    try {
      const privateKey = (0, import_encoding.toUtf8)(key);
      const wallet = await import_proto_signing.DirectSecp256k1Wallet.fromKey(privateKey, "juno");
      const client = await import_cosmwasm_stargate.SigningCosmWasmClient.connectWithSigner(
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
  const [address, setAddress] = (0, import_react2.useState)("");
  const [client, setClient] = (0, import_react2.useState)("");
  const [wallet, setWallet] = (0, import_react2.useState)("");
  const count = (0, import_react2.useRef)(0);
  const socket = (0, import_socket.default)(config.backend_url, {
    transports: ["websocket"],
    withCredentials: true
  });
  (0, import_react2.useEffect)(() => {
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
    const cookie = import_js_cookie.default.get("cookie");
    cookie && socket.id && socket.emit("getToken", { cookie, id: socket.id });
  };
  const initialize = () => {
    getToken();
    const address2 = import_js_cookie.default.get("address");
    address2 && setAddress(address2);
  };
  (0, import_react2.useEffect)(() => {
    const interval = setInterval(() => {
      if (!client && count.current <= 7) {
        initialize();
        count.current += 1;
      }
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  (0, import_react2.useEffect)(() => {
    const handler = (event) => {
      if (event.data.address) {
        setAddress(event.data.address);
        import_js_cookie.default.set("cookie", event.data.cookie);
        import_js_cookie.default.set("address", event.data.address);
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
    import_js_cookie.default.set("cookie", "");
    import_js_cookie.default.set("address", "");
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
var import_react3 = __toESM(require("react"), 1);
var import_classnames = __toESM(require("classnames"), 1);

// src/components/LoginWithGoogle.css
var LoginWithGoogle_default = {};

// src/components/LoginWithGoogle.tsx
var LoginWithGoogle = (props) => {
  return /* @__PURE__ */ import_react3.default.createElement("div", { ...props, className: (0, import_classnames.default)(LoginWithGoogle_default.googleBtn, props?.className) }, /* @__PURE__ */ import_react3.default.createElement("div", { className: (0, import_classnames.default)(LoginWithGoogle_default.googleIconWrapper, "wrapper") }, /* @__PURE__ */ import_react3.default.createElement(
    "img",
    {
      className: LoginWithGoogle_default.googleIcon,
      src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuODc1NjcgMTQuMjk0Nkw1LjEwOTg4IDE3LjE1MzRMMi4zMTA5MyAxNy4yMTI2QzEuNDc0NDYgMTUuNjYxMSAxIDEzLjg4NiAxIDExLjk5OTdDMSAxMC4xNzU2IDEuNDQzNjEgOC40NTU1MiAyLjIyOTk0IDYuOTQwOTJIMi4yMzA1NEw0LjcyMjM4IDcuMzk3NzZMNS44MTM5NiA5Ljg3NDY1QzUuNTg1NSAxMC41NDA3IDUuNDYwOTcgMTEuMjU1NyA1LjQ2MDk3IDExLjk5OTdDNS40NjEwNiAxMi44MDcyIDUuNjA3MzMgMTMuNTgwOCA1Ljg3NTY3IDE0LjI5NDZaIiBmaWxsPSIjRkJCQjAwIi8+CjxwYXRoIGQ9Ik0yMi44MDcyIDkuOTQ1MzFDMjIuOTMzNSAxMC42MTA3IDIyLjk5OTQgMTEuMjk3OSAyMi45OTk0IDEyLjAwMDNDMjIuOTk5NCAxMi43ODc4IDIyLjkxNjYgMTMuNTU2IDIyLjc1ODggMTQuMjk3QzIyLjIyMzQgMTYuODE4NSAyMC44MjQyIDE5LjAyMDMgMTguODg1OSAyMC41Nzg0TDE4Ljg4NTMgMjAuNTc3OEwxNS43NDY3IDIwLjQxNzdMMTUuMzAyNSAxNy42NDQ3QzE2LjU4ODYgMTYuODkwNCAxNy41OTM3IDE1LjcxIDE4LjEyMzIgMTQuMjk3SDEyLjI0MTJWOS45NDUzMUgxOC4yMDlIMjIuODA3MloiIGZpbGw9IiM1MThFRjgiLz4KPHBhdGggZD0iTTE4Ljg4NTUgMjAuNTc3NkwxOC44ODYxIDIwLjU3ODJDMTcuMDAxIDIyLjA5MzQgMTQuNjA2NCAyMyAxMS45OTk2IDIzQzcuODEwNTUgMjMgNC4xNjg0NyAyMC42NTg2IDIuMzEwNTUgMTcuMjEyOUw1Ljg3NTI4IDE0LjI5NDlDNi44MDQyMiAxNi43NzQxIDkuMTk1ODIgMTguNTM5IDExLjk5OTYgMTguNTM5QzEzLjIwNDggMTguNTM5IDE0LjMzMzggMTguMjEzMiAxNS4zMDI2IDE3LjY0NDVMMTguODg1NSAyMC41Nzc2WiIgZmlsbD0iIzI4QjQ0NiIvPgo8cGF0aCBkPSJNMTkuMDIwOCAzLjUzMjQxTDE1LjQ1NzMgNi40NDk4MUMxNC40NTQ2IDUuODIzMDcgMTMuMjY5NCA1LjQ2MTAyIDExLjk5OTYgNS40NjEwMkM5LjEzMjMgNS40NjEwMiA2LjY5NTk3IDcuMzA2ODMgNS44MTM1NiA5Ljg3NDk0TDIuMjMwMDkgNi45NDEyMUgyLjIyOTQ5QzQuMDYwMjIgMy40MTE1NCA3Ljc0ODIzIDEgMTEuOTk5NiAxQzE0LjY2ODYgMSAxNy4xMTU4IDEuOTUwNzMgMTkuMDIwOCAzLjUzMjQxWiIgZmlsbD0iI0YxNDMzNiIvPgo8L3N2Zz4K"
    }
  )), /* @__PURE__ */ import_react3.default.createElement("div", { className: LoginWithGoogle_default.text }, /* @__PURE__ */ import_react3.default.createElement("p", { className: LoginWithGoogle_default.btnText }, /* @__PURE__ */ import_react3.default.createElement("b", null, "Continue with Google"))));
};
var LoginWithGoogle_default2 = LoginWithGoogle;

// src/components/LoginWithFB.tsx
var import_classnames2 = __toESM(require("classnames"), 1);
var import_react4 = __toESM(require("react"), 1);
var LoginWithFB = (props) => {
  return /* @__PURE__ */ import_react4.default.createElement("div", { ...props, className: (0, import_classnames2.default)(LoginWithGoogle_default.googleBtn, props?.className) }, /* @__PURE__ */ import_react4.default.createElement("div", { className: LoginWithGoogle_default.googleIconWrapper }, /* @__PURE__ */ import_react4.default.createElement("img", { className: LoginWithGoogle_default.googleIcon, src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDEyQzI0IDE3Ljk4OTcgMTkuNjExNiAyMi45NTQyIDEzLjg3NSAyMy44NTQyVjE1LjQ2ODhIMTYuNjcxMUwxNy4yMDMxIDEySDEzLjg3NVY5Ljc0OTA2QzEzLjg3NSA4Ljc5OTg0IDE0LjM0IDcuODc1IDE1LjgzMDYgNy44NzVIMTcuMzQzOFY0LjkyMTg4QzE3LjM0MzggNC45MjE4OCAxNS45NzAzIDQuNjg3NSAxNC42NTczIDQuNjg3NUMxMS45MTY2IDQuNjg3NSAxMC4xMjUgNi4zNDg3NSAxMC4xMjUgOS4zNTYyNVYxMkg3LjA3ODEyVjE1LjQ2ODhIMTAuMTI1VjIzLjg1NDJDNC4zODg0NCAyMi45NTQyIDAgMTcuOTg5NyAwIDEyQzAgNS4zNzI4MSA1LjM3MjgxIDAgMTIgMEMxOC42MjcyIDAgMjQgNS4zNzI4MSAyNCAxMloiIGZpbGw9IiMxODc3RjIiLz4KPHBhdGggZD0iTTE2LjY3MTEgMTUuNDY4OEwxNy4yMDMxIDEySDEzLjg3NVY5Ljc0OTAyQzEzLjg3NSA4LjgwMDAzIDE0LjMzOTkgNy44NzUgMTUuODMwNiA3Ljg3NUgxNy4zNDM4VjQuOTIxODhDMTcuMzQzOCA0LjkyMTg4IDE1Ljk3MDUgNC42ODc1IDE0LjY1NzYgNC42ODc1QzExLjkxNjUgNC42ODc1IDEwLjEyNSA2LjM0ODc1IDEwLjEyNSA5LjM1NjI1VjEySDcuMDc4MTJWMTUuNDY4OEgxMC4xMjVWMjMuODU0MkMxMC43MzYgMjMuOTUgMTEuMzYyMSAyNCAxMiAyNEMxMi42Mzc5IDI0IDEzLjI2NCAyMy45NSAxMy44NzUgMjMuODU0MlYxNS40Njg4SDE2LjY3MTFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" })), /* @__PURE__ */ import_react4.default.createElement("div", { className: LoginWithGoogle_default.text }, /* @__PURE__ */ import_react4.default.createElement("p", { className: LoginWithGoogle_default.btnText }, /* @__PURE__ */ import_react4.default.createElement("b", null, "Continue with Facebook"))));
};
var LoginWithFB_default = LoginWithFB;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginWithFB,
  LoginWithGoogle,
  WalletProvider,
  useWallet
});
