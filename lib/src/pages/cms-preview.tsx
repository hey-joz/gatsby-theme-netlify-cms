import React, { FC, memo } from "react";

import usePreview from "../hooks/usePreview";

const CmsPreview: FC = () => {
  const data = usePreview<any>();

  if (!data) {
    return null;
  }

  return <pre>{JSON.stringify(data, undefined, 2)}</pre>;
};

export default memo(CmsPreview);
