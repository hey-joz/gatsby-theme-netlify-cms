import NetlifyAPI from "netlify";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const SITE_ID = process.env.SITE_ID;

const handler = async (req, res) => {
  if (!TOKEN) {
    res.status(401).json({ error: "missing NETLIFY_ACCESS_TOKEN" });
    return;
  }

  const client = new NetlifyAPI(TOKEN);

  const deploys = await client.listSiteDeploys({
    site_id: SITE_ID,
  });

  res.status(200).json(deploys);
};

export default handler;
