import { useCallback, useEffect, useState } from "react";

const usePreview = <T>(): T | null => {
  const [data, setData] = useState<T | null>(null);

  const receiveMessage = useCallback((message: MessageEvent) => {
    setData(message.data);
  }, []);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);

    const lifeCyclePayload = {
      type: "lifeCycle",
      lifeCycle: "mounted",
    };

    window.top.postMessage(lifeCyclePayload, "*");

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [receiveMessage]);

  return data;
};

export default usePreview;
