import { CmsWidgetControlProps } from "netlify-cms-core";
import React, { FC, memo, useEffect } from "react";
import { v4 } from "uuid";

const Uuid: FC<CmsWidgetControlProps> = ({
  classNameWrapper,
  value,
  onChange,
  forID,
}) => {
  const uuid = v4();
  const _value = value || uuid;

  useEffect(() => {
    onChange(_value);
  }, [onChange, _value]);

  return (
    <input
      className={classNameWrapper}
      type="text"
      id={forID}
      value={_value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      disabled
      style={{
        backgroundColor: "#f5f5f5",
      }}
    />
  );
};

export default memo(Uuid);
