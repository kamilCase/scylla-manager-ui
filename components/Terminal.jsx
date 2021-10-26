/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { v4 as uuid } from "uuid";
import { BsList } from "react-icons/bs";
const messageTypes = {
  input: "INPUT",
  output: "OUTPUT",
  done: "DONE",
};

const TerminalContainer = styled.div`
  height: 70vh;
`;

// TODO: can we assume returned messages and ips order?
const colors = [
  "text-blue-400",
  "text-purple-400",
  "text-yellow-400",
  "text-red-400",
  "text-indigo-400",
  "text-fuchsia-400",
  "text-orange-400",
  "text-rose-400",
  "text-lime-400",
  "text-pink-400",
  "text-teal-400",
];

const Spinner = () => (
  <div className="h-8 w-8 bg-gray-700 rounded-lg absolute bottom-20 right-10">
    <svg
      fill="none"
      className="w-8 h-8 animate-spin"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
        fill="currentColor"
      />
    </svg>
  </div>
);
function useTerminal(clusterId, host) {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState();
  useEffect(
    function connect() {
      let wsI;
      const isBrowser = typeof window !== "undefined";
      if (isBrowser && clusterId) {
        const url = `ws://${"18.194.211.185"}:5080/api/v1/cluster/${clusterId}/exec_ws${
          host ? `?host=${host}` : ""
        }`;
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
          if (message?.includes("___SM_COMMAND_DONE")) {
            return setMessages((oldMessages) => [
              ...oldMessages,
              {
                message: message,
                type: messageTypes.done,
                id: uuid(),
              },
            ]);
          }
          const ipSeparator = message.indexOf("|");
          return setMessages((oldMessages) => [
            ...oldMessages,
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

function parseMessages(messages) {
  if (!messages.length) {
    return [];
  }

  let parsed = [],
    output = {},
    lastInput;
  for (let message of messages) {
    if (message.type === messageTypes.input) {
      lastInput = message;
    } else if (message.type === messageTypes.output) {
      output = {
        ...output,
        [message.ip]: output[message.ip]
          ? [...output[message.ip], message]
          : [message],
      };
    } else if (message.type === messageTypes.done) {
      parsed.push({
        input: lastInput,
        output,
        inProgress: false,
        id: `${lastInput.id}-command`,
      });
      output = {};
    }
  }

  if (messages[messages.length - 1].type === messageTypes.input) {
    parsed.push({
      input: lastInput,
      inProgress: true,
      id: `${lastInput.id}-command`,
    });
  } else if (messages[messages.length - 1].type === messageTypes.output) {
    parsed.push({
      input: lastInput,
      output,
      inProgress: true,
      id: `${lastInput.id}-command`,
    });
  }

  return parsed;
}

function Terminal({ clusterId, host }) {
  const [message, setMessage] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [messages, submitMessage, clear] = useTerminal(clusterId, host);
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

  const parsedMessages = parseMessages(messages);

  return (
    <TerminalContainer className="w-full">
      <div
        className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              bg-gray-800 pb-6 rounded-lg leading-normal h-full overflow-y-auto"
      >
        <div
          key="view-toggle"
          className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex sticky top-0"
        >
          <button
            className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${
              isGridView ? "bg-white rounded-full text-blue-400" : ""
            }`}
            onClick={() => setIsGridView((isGr) => !isGr)}
          >
            <BsList className="transform rotate-90" />
            <span className="ml-1">Grid</span>
          </button>
          <button
            className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2 ${
              !isGridView ? "bg-white rounded-full text-blue-400" : ""
            }`}
            id="list"
            onClick={() => setIsGridView((isGr) => !isGr)}
          >
            <BsList />
            <span className="ml-1">List</span>
          </button>
        </div>
        {parsedMessages?.map(({ input, output, id, inProgress }) => (
          <div key={id}>
            {inProgress && <Spinner />}
            <div className="mt-4 flex" key={`${id}-input`}>
              <span className="text-green-400">$</span>
              <p className="flex-1 typing items-center pl-2">{input.message}</p>
            </div>
            <div className={`${isGridView ? "flex" : ""}`} key={`${id}-output`}>
              {output &&
                Object.keys(output).flatMap((ip) => (
                  <div className="flex-col mr-8" key={`${id}-${ip}`}>
                    {output[ip]?.map((message) => (
                      <div
                        className="flex-col typing items-center pl-2"
                        key={message.id}
                      >
                        <span className={getIpColor(ip)}>{ip} </span>
                        <em>{message.message}</em>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        ))}
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
    </TerminalContainer>
  );
}

export default Terminal;
