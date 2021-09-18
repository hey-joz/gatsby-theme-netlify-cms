import { CmsWidgetControlProps } from "netlify-cms-core";
import React, { FC, memo, useEffect, useRef } from "react";
import slugify from "slugify";

const Path: FC<CmsWidgetControlProps> = ({
  classNameWrapper,
  forID,
  value,
  onChange,
  // @ts-expect-error untyped prop
  setActiveStyle,
  // @ts-expect-error untyped prop
  setInactiveStyle,
  // @ts-expect-error untyped prop
  entry,
}) => {
  const entryRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  return (
    <div className={classNameWrapper}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>{"/"}</div>
        <div style={{ flex: 1 }}>
          <input
            ref={inputRef}
            type="text"
            id={forID}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            onFocus={setActiveStyle}
            onBlur={(event) => {
              onChange(slugify(event.target.value, { lower: true }));
              setInactiveStyle(event);
            }}
            style={{
              fontSize: "inherit",
              lineHeight: "inherit",
              color: "inherit",
              fontFamily: "inherit",
              display: "block",
              width: "100%",
            }}
          />
        </div>
        <div>
          <button
            onClick={() => {
              inputRef.current?.focus();

              setTimeout(() => {
                const title = entryRef.current?.getIn(["data", "title"]) || "";
                onChange(slugify(title, { lower: true }));
              }, 0);
            }}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "2px 12px",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "3px",
            }}
          >
            {"Auto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Path);
