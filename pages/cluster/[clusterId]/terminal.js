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
          setMessages([
            ...messages,
            { message, type: messageTypes.output, id: uuid() },
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

function ClusterTerminalPage() {
  const router = useRouter();
  const { clusterId } = router.query;

  const [message, setMessage] = useState([]);
  const [messages, submitMessage, clear] = useTerminal(clusterId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!clusterId) return <div>loading...</div>;

  return (
    <Layout>
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-400">
        <span className="font-bold">TERMINAL PAGE</span>
      </h1>

      <Terminal className="w-full">
        <div
          className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              bg-gray-800  pb-6 rounded-lg leading-normal h-full overflow-y-scroll"
        >
          {messages.map(({ message, type, id }) =>
            type === messageTypes.output ? (
              <div className="flex-1 typing items-center pl-2" key={id}>
                <em>{message}</em>
              </div>
            ) : (
              <div className="mt-4 flex" key={id} ref={messagesEndRef}>
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
                setMessage([]);
              }}
            >
              <div className="mt-4 flex">
                <span className="text-green-400">$</span>
                <input
                  className="flex-1 typing items-center pl-2 bg-gray-800 outline-none focus:outline-none border-gray-800"
                  type="text"
                  value={message}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "u") {
                      e.preventDefault();
                      clear();
                      console.log("clean");
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
