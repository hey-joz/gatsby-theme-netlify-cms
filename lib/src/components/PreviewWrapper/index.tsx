import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  data: any;
};

type PreviewMode = "iframe" | "window";

const PREVIEW_URL = "/cms-preview";
const PREVIEW_FRAME_NAME = "preview";

const PreviewWrapper: FC<Props> = ({ data }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("iframe");

  const previewIFrameRef = useRef<HTMLIFrameElement | null>(null);
  const previewWindowRef = useRef<Window | null>(null);
  const previewWindowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const receiveLifeCycleMessage = useCallback(
    (message) => {
      if (
        message.data?.type === "lifeCycle" &&
        message.data?.payload === "mounted"
      ) {
        switch (previewMode) {
          case "iframe": {
            previewIFrameRef.current?.contentWindow?.postMessage(
              { type: "widgets", payload: data },
              "*"
            );
            break;
          }
          case "window": {
            previewWindowRef.current?.postMessage(
              { type: "widgets", payload: data },
              "*"
            );
            break;
          }
        }
      }
    },
    [data, previewMode]
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
    switch (previewMode) {
      case "iframe": {
        previewIFrameRef.current?.contentWindow?.postMessage(
          { type: "widgets", payload: data },
          "*"
        );
        break;
      }
      case "window": {
        previewWindowRef.current?.postMessage(
          { type: "widgets", payload: data },
          "*"
        );
        break;
      }
    }
  }, [data, previewMode]);

  // Closing preview window on leave
  useEffect(() => {
    return () => {
      previewWindowRef.current?.close();
    };
  }, []);

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
      {previewMode === "iframe" && (
        <iframe
          ref={previewIFrameRef}
          src={PREVIEW_URL}
          title={PREVIEW_FRAME_NAME}
          style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: "62px",
          right: "10px",
          zIndex: 299,
        }}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (previewMode === "iframe") {
            setPreviewMode("window");

            previewWindowRef.current = window.open(
              PREVIEW_URL,
              PREVIEW_FRAME_NAME,
              "toolbar=0,location=0,menubar=0"
            );

            if (previewWindowRef.current) {
              if (previewWindowIntervalRef.current) {
                clearInterval(previewWindowIntervalRef.current);
              }

              previewWindowIntervalRef.current = setInterval(() => {
                if (
                  !previewWindowRef.current ||
                  previewWindowRef.current?.closed
                ) {
                  setPreviewMode("iframe");
                }
              }, 1000);
            }
          } else {
            setPreviewMode("iframe");

            previewWindowRef.current?.close();

            if (previewWindowIntervalRef.current) {
              clearInterval(previewWindowIntervalRef.current);
            }
          }
        }}
        onKeyPress={() => {}}
      >
        <div
          style={{
            border: "0px",
            cursor: "pointer",
            boxShadow:
              "rgba(68, 74, 87, 0.15) 0px 2px 6px 0px, rgba(68, 74, 87, 0.3) 0px 1px 3px 0px",
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgb(58, 105, 199)",
            borderRadius: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px",
            padding: "0px",
            marginBottom: "12px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: "24px", height: "24px", display: "block" }}
          >
            {previewMode === "iframe" ? (
              <path
                fill="currentColor"
                d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M12,10L8,14H11V20H13V14H16M19,4H5C3.89,4 3,4.9 3,6V18A2,2 0 0,0 5,20H9V18H5V8H19V18H15V20H19A2,2 0 0,0 21,18V6A2,2 0 0,0 19,4Z"
              />
            )}
          </svg>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(PreviewWrapper);
