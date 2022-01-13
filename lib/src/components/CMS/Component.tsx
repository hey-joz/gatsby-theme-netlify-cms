import { Global } from "@emotion/react";
import React, { FC, Fragment, memo, ReactNode } from "react";
import { Helmet } from "react-helmet";

const CMSComponent: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Fragment>
      <Global
        styles={{
          html: {
            backgroundColor: "transparent",
            overflowY: "auto",
          },
          'button[title*="Défilement"]': {
            display: "none",
          },
          'div[role="menu"] > ul': {
            width: "auto !important",
            minWidth: "200px !important",
          },
          'button[class*="FileWidgetButton"]': {
            marginTop: "1em",
            marginBottom: 0,
            "&:first-of-type": {
              marginTop: 0,
            },
          },
          'button[class*="FileWidgetButton-button"] + button[class*="FileWidgetButton-button"]':
            {
              display: "none",
            },
        }}
      />
      <Helmet defer={false}>
        <meta name="robots" content="none" />
      </Helmet>
      {children}
    </Fragment>
  );
};

export default memo(CMSComponent);
