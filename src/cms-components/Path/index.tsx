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
              backgroundColor: "rgb(121, 130, 145)",
              border: "none",
              borderRadius: "5px",
              color: "rgb(255, 255, 255)",
              cursor: "pointer",
              display: "block",
              fontWeight: 500,
              height: "26px",
              lineHeight: "26px",
              padding: "0px 10px",
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
