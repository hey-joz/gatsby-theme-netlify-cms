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
          right: 0,
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
                d="M1 12H10.8L8.3 9.5L9.7 8.1L14.6 13L9.7 17.9L8.3 16.5L10.8 14H1V12M21 2H3C1.9 2 1 2.9 1 4V10.1H3V6H21V20H3V16H1V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2"
              />
            )}
          </svg>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(PreviewWrapper);
