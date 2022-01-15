import { useCallback, useEffect, useState } from "react";

const usePreview = <T>(): T | null => {
  const [data, setData] = useState<T | null>(null);

  const receiveMessage = useCallback((message: MessageEvent) => {
    if (message.data?.type === "widgets") {
      setData(message.data?.payload);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);

    (window.opener || window.top)?.postMessage(
      {
        type: "lifeCycle",
        payload: "mounted",
      },
      "*"
    );

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [receiveMessage]);

  return data;
};

export default usePreview;
