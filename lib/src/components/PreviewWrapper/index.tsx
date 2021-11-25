import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Props = {
  data: any;
};

const PreviewWrapper: FC<Props> = ({ data }) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const receiveLifeCycleMessage = useCallback(
    (message) => {
      if (
        message.data?.type === "lifeCycle" &&
        message.data.lifeCycle === "mounted"
      ) {
        frameRef.current?.contentWindow?.postMessage(data, "*");
      }
    },
    [data]
  );

  // react to target frame mounted
  useEffect(() => {
    window.addEventListener("message", receiveLifeCycleMessage);

    return () => {
      window.removeEventListener("message", receiveLifeCycleMessage);
    };
  }, [receiveLifeCycleMessage]);

  // Send update on data change
  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(data, "*");
  }, [data]);

  return (
    <Fragment>
      <style>
        {`
        html {
          height: 100%;
          overflow: hidden;
        }

        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }

        body > div {
          height: 100%;
        }

        .frame-content {
          height: 100%;
        }
        `}
      </style>
      <iframe
        ref={frameRef}
        src={"/cms-preview"}
        title="preview"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </Fragment>
  );
};

export default memo(PreviewWrapper);
