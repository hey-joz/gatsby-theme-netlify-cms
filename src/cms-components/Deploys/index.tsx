/** @jsx jsx */
import type { CmsWidgetControlProps } from "@hey_joz/gatsby-source-netlify-cms/types";
import { DateTime, Duration } from "luxon";
import { FC, memo, useEffect, useState } from "react";
import { Badge, Flex, Grid, jsx, Spinner } from "theme-ui";

type Deploy = {
  id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  state?: "new" | "ready" | "building" | "error" | null;
  error_message?: string | null;
  title?: string | null;
  deploy_time?: number | null;
  skipped?: boolean | null;
};

const CANCELED_BUILD_ERROR_MESSAGE = "Canceled build";

const formatDate = (date: string): string => {
  return DateTime.fromISO(date).toLocaleString(
    DateTime.DATETIME_SHORT_WITH_SECONDS
  );
};

const DeployItem: FC<{ deploy: Deploy }> = memo(({ deploy }) => {
  return (
    <div sx={{ padding: 2 }}>
      <Flex
        sx={{
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <Grid gap={1}>
          {/** status + title */}
          <Flex sx={{ gap: 2, fontWeight: "bold", alignItems: "center" }}>
            {deploy.state === "building" && (
              <Spinner color={"#3a69c7"} sx={{ height: "1em", width: "1em" }} />
            )}
            {deploy.state === "new" && <span>{"⧖"}</span>}
            {(deploy.state === "ready" || deploy.skipped) && (
              <span sx={{ color: "green" }}>{"✓"}</span>
            )}
            {deploy.state === "error" && !deploy.skipped && (
              <span sx={{ color: "red" }}>{"✗"}</span>
            )}
            <div>{deploy.title || "..."}</div>
          </Flex>
          {/** error message */}
          {deploy.state === "error" &&
            deploy.error_message &&
            deploy.error_message !== CANCELED_BUILD_ERROR_MESSAGE &&
            !deploy.skipped && <div>{deploy.error_message}</div>}
        </Grid>
        <div
          sx={{
            gap: 1,
            color: "rgb(122, 130, 145)",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          {/** created at */}
          <div sx={{ fontWeight: "bold" }}>
            {deploy.created_at ? formatDate(deploy.created_at) : null}
          </div>
          {/** special status */}
          {deploy.skipped && (
            <Badge sx={{ background: "rgb(122, 130, 145)" }}>{"Sauté"}</Badge>
          )}
          {deploy.state === "building" && (
            <Badge sx={{ background: "rgb(122, 130, 145)" }}>
              {"En cours"}
            </Badge>
          )}
          {deploy.state === "new" && (
            <Badge sx={{ background: "rgb(122, 130, 145)" }}>
              {"En attente"}
            </Badge>
          )}
          {deploy.error_message === CANCELED_BUILD_ERROR_MESSAGE && (
            <Badge sx={{ background: "rgb(122, 130, 145)" }}>{"Annulé"}</Badge>
          )}
          {/** duration */}
          {(deploy.deploy_time || 0) > 0 ? (
            <div>{`Déployé en ${Duration.fromMillis(
              (deploy.deploy_time || 0) * 1000
            )
              .toFormat("m:s")
              .split(":")
              .join("m ")}s`}</div>
          ) : null}
        </div>
      </Flex>
    </div>
  );
});

const Deploys: FC<CmsWidgetControlProps> = ({ classNameWrapper }) => {
  const [deploys, setDeploys] = useState<Deploy[] | null>(null);

  const getDeploys = async function () {
    const deploys: Deploy[] = await fetch("/api/listSiteDeploys").then(
      (res) => res.json(),
      (error) => {
        console.error(error);
      }
    );
    setDeploys(deploys);
  };

  useEffect(() => {
    getDeploys();

    const interval = setInterval(() => {
      getDeploys();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={classNameWrapper}>
      {!deploys && (
        <div sx={{ textAlign: "center" }}>
          <Spinner color={"#3a69c7"} strokeWidth={2} />
        </div>
      )}
      {(deploys?.length || 0) > 0 && (
        <ul sx={{ margin: 0, padding: 0, listStyle: "none" }}>
          {deploys?.map((deploy) => {
            return (
              <li
                key={deploy.id}
                sx={{
                  borderTop: "2px solid rgb(223, 223, 227)",
                  "&:first-of-type": {
                    borderTop: "none",
                  },
                }}
              >
                <DeployItem deploy={deploy} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default memo(Deploys);
