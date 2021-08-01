import { CmsWidgetControlProps } from "netlify-cms-core";
import React, { FC, memo } from "react";
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
}) => {
  return (
    <div className={classNameWrapper}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>{"/"}</div>
        <div style={{ flex: 1 }}>
          <input
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
      </div>
    </div>
  );
};

export default memo(Path);
