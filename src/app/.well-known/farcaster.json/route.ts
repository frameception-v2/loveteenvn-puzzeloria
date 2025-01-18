import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAibG92ZXRlZW52bi1wdXp6ZWxvcmlhLnZlcmNlbC5hcHAifQ",
      signature:
        "MHhhOTEyMjk1NDVkOTc1MTk1M2I0MGNkNzMxMWFjNzQyMmU5MjQxNWE5NDJiYjJiNzU3YzYxM2Q5NDI4MmJlY2M0M2UwMmIzOTQ3MWY0YzE4NmRmYzNjMmNjYjgyNTcyMDU0Yzk0M2E3ZGIyZWY4MTBjOGZkZjE5NDEyYTBjOGQ3NzFi",
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
