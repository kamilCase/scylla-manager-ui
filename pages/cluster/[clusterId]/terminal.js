import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { v4 as uuid } from "uuid";
import Layout from "components/Layout";

const messageTypes = {
  input: "INPUT",
  output: "OUTPUT",
};

const Terminal = styled.div`
  height: 80vh;
`;

// TODO: can we assume returned messages and ips order?
const colors = [
  "blue",
  "purple",
  "yellow",
  "red",
  "Indigo",
  "fuchsia",
  "orange",
  "rose",
  "lime",
  "pink",
  "teal",
];

function useTerminal(clusterId) {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState();
  useEffect(
    function connect() {
      let wsI;
      const isBrowser = typeof window !== "undefined";
      if (isBrowser && clusterId) {
        const url = `ws://${window.location.hostname}:5080/api/v1/cluster/${clusterId}/exec_ws`;
        wsI = new WebSocket(url);
        setWs(wsI);
      }

      return () => {
        // Cleanup on unmount if ws wasn't closed already
        if (wsI && wsI.readyState !== 3) {
          wsI.close(1000, "navigation out");
          console.log("ws closed");
        }
      };
    },
    [clusterId, setWs]
  );

  useEffect(
    function handleConnection() {
      if (ws) {
        ws.onopen = () => {
          console.log("ws connected");
        };

        ws.onmessage = (e) => {
          const message = e.data;
          const ipSeparator = message.indexOf("|");
          setMessages([
            ...messages,
            {
              message: message.slice(ipSeparator + 2), // "separator and space"
              ip: message.slice(0, ipSeparator),
              type: messageTypes.output,
              id: uuid(),
            },
          ]);
        };
      }
    },
    [ws, messages]
  );
  const clear = useCallback(() => setMessages([]), [setMessages]);
  const submitMessage = (message) => {
    if (message === "clear") {
      clear();
    } else {
      setMessages([
        ...messages,
        { message, type: messageTypes.input, id: uuid() },
      ]);
      ws.send(message);
    }
  };

  return [messages, submitMessage, clear];
}

// TODO: for the hackathon, history is unlimited
function useMessageHistory() {
  const [messageHistory, setMessageHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateHistory = (message) => {
    setMessageHistory([message, ...messageHistory]);
    setHistoryIndex(0);
  };

  const olderMessage = () => {
    if (messageHistory?.length) {
      const message = messageHistory[historyIndex];
      setHistoryIndex((prevIndex) =>
        prevIndex === messageHistory.length - 1 ? prevIndex : prevIndex + 1
      );

      return message;
    }
  };

  const newerMessage = () => {
    if (messageHistory?.length > 1) {
      const message = messageHistory[historyIndex - 1];
      setHistoryIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));

      return message;
    }
  };
  return [updateHistory, olderMessage, newerMessage];
}

function ClusterTerminalPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const [message, setMessage] = useState([]);
  const [messages, submitMessage, clear] = useTerminal(clusterId);
  const [updateHistory, olderMessage, newerMessage] = useMessageHistory();
  const inputRef = useRef(null);

  const [ips, setIps] = useState([]);
  const getIpColor = useCallback(
    (ip) => {
      if (ips.indexOf(ip) !== -1) {
        return colors[ips.indexOf(ip)];
      } else {
        const color = colors[ips.length - 1];
        setIps((prevIps) => [...prevIps, ip]);
        return color;
      }
    },
    [ips, setIps]
  );

  useEffect(
    function scrollToEnd() {
      inputRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages]
  );

  useEffect(
    function moveInputCursorToEnd() {
      if (inputRef.current) {
        inputRef.current.selectionStart = message.length + 1;
      }
    },
    [message]
  );

  if (!clusterId) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <span className="font-bold">TERMINAL PAGE</span>
      </h1>

      <Terminal className="w-full">
        <div
          className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              bg-gray-800 bg-  pb-6 rounded-lg leading-normal h-full overflow-y-scroll"
        >
          {messages.map(({ message, type, ip, id }) =>
            type === messageTypes.output ? (
              <div className="flex-1 typing items-center pl-2" key={id}>
                <span className={`text-${getIpColor(ip)}-400`}>{ip} </span>
                <em>{message}</em>
              </div>
            ) : (
              <div className="mt-4 flex" key={id}>
                <span className="text-green-400">$</span>
                <p className="flex-1 typing items-center pl-2">{message}</p>
              </div>
            )
          )}
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitMessage(message);
                updateHistory(message);
                setMessage([]);
              }}
            >
              <div className="mt-4 flex">
                <span className="text-green-400">$</span>
                <input
                  ref={inputRef}
                  className="flex-1 typing items-center pl-2 bg-gray-800 outline-none focus:outline-none border-gray-800"
                  type="text"
                  value={message}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "u") {
                      e.preventDefault();
                      clear();
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      const msg = olderMessage();
                      if (msg) {
                        setMessage(msg);
                      }
                    }
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const msg = newerMessage();
                      if (msg) {
                        setMessage(msg);
                      }
                    }
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </Terminal>
    </Layout>
  );
}

export default ClusterTerminalPage;
