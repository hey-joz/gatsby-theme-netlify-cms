import { CmsWidgetControlProps } from "netlify-cms-core";
import React, { FC, memo, useEffect } from "react";
import { v4 } from "uuid";

const Uuid: FC<CmsWidgetControlProps> = ({
  classNameWrapper,
  value,
  onChange,
  forID,
}) => {
  useEffect(() => {
    if (!value) {
      const uuid = v4();
      onChange(uuid);
    }
  }, []);

  return (
    <input
      className={classNameWrapper}
      type="text"
      id={forID}
      value={value}
      disabled
      style={{
        backgroundColor: "#f5f5f5",
      }}
    />
  );
};

export default memo(Uuid);
