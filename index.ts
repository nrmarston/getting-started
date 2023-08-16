/**
 * See all code examples: https://github.com/FlatFilers/flatfile-docs-kitchen-sink
 */

import { recordHook, FlatfileRecord } from "@flatfile/plugin-record-hook";
import { FlatfileEvent, FlatfileListener } from "@flatfile/listener";
import { contactSheet1 } from "./sheets/contactSheet1";
import { contactSheet2 } from "./sheets/contactSheet2";
import { contactSheet3 } from "./sheets/contactSheet3";
import { ccSheet } from "./sheets/costCenter";
import api from "@flatfile/api";
import axios from "axios";

export default function (listener: FlatfileListener) {
  /**
   * Part 1 example
   */
  listener.on("**", ({ topic }: FlatfileEvent) => {
    console.log(`Received event: ${topic}`);
  });

  //when the "Create new Space" button is clicked in the UI
  listener.filter({ job: "space:configure" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { spaceId, environmentId, jobId } }) => {
        await api.jobs.ack(jobId, {
          info: "Creating space...",
          progress: 10,
        });

        const { data: workbook } = await api.workbooks.create({
          spaceId,
          environmentId,
          name: "All Data",
          labels: ["primary"],
          sheets: [contactSheet1, contactSheet2, contactSheet3, ccSheet],
          actions: [
            {
              operation: "submitAction",
              mode: "foreground",
              label: "Submit",
              type: "string",
              description: "Submit data to webhook.site",
              primary: true,
            },
          ],
        });

        // sets the workbook as the primary to enable the data checklist
        await api.spaces.update(spaceId, {
          environmentId,
          primaryWorkbookId: workbook.id,
        });

        await api.documents.create(spaceId, {
          title: "Getting Started",
          body: `# Welcome
  ### Say hello to your first customer Space in the new Flatfile!
  Let's begin by first getting acquainted with what you're seeing in your Space initially.
  ---`,
        });

        await api.jobs.complete(jobId, {
          outcome: {
            message: "This job is now complete.",
          },
        });
      }
    );
  });

  /**
   * Part 2 example
   */
  listener.use(
    recordHook("contacts1", (record: FlatfileRecord) => {

      const value = record.get("firstName");
      if (typeof value === "string") {
        record.set("firstName", value.toLowerCase());
      }

      const email = record.get("email") as string;
      const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailAddress.test(email)) {
        console.log("Invalid email address");
        record.addError("email", "Invalid email address");
      }

      return record;
    })
  );

  listener.use(
    recordHook("contacts2", (record: FlatfileRecord) => {

      const value = record.get("firstName");
      if (typeof value === "string") {
        record.set("firstName", value.toLowerCase());
      }

      const email = record.get("email") as string;
      const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailAddress.test(email)) {
        console.log("Invalid email address");
        record.addError("email", "Invalid email address");
      }

      return record;
    })
  );

  listener.use(
    recordHook("contacts3", (record: FlatfileRecord) => {

      const value = record.get("firstName");
      if (typeof value === "string") {
        record.set("firstName", value.toLowerCase());
      }

      const email = record.get("email") as string;
      const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailAddress.test(email)) {
        console.log("Invalid email address");
        record.addError("email", "Invalid email address");
      }

      if (record.get('ccNameRef')) {
        const links = record.getLinks('ccNameRef')
        console.log(`Links: ${JSON.stringify(links, null, 2)}`)
        const lookupValue = links?.[0]?.['code']
        const targetField = 'ccId'
        record.set(targetField, lookupValue)
        record.addInfo(targetField, 'From linked file')
      }

      return record;
    })
  );

  /**
   * Part 3 example
   */
  // listener.filter({ job: "workbook:submitAction" }, (configure) => {
  //   configure.on(
  //     "job:ready",
  //     async ({ context: { jobId, workbookId }, payload }: FlatfileEvent) => {
  //       const { data: sheets } = await api.sheets.list({ workbookId });

  //       const records: { [name: string]: any } = {};
  //       for (const [index, element] of sheets.entries()) {
  //         records[`Sheet[${index}]`] = await api.records.get(element.id);
  //       }

  //       try {
  //         await api.jobs.ack(jobId, {
  //           info: "Starting job to submit action to webhook.site",
  //           progress: 10,
  //         });

  //         console.log(JSON.stringify(records, null, 2));

  //         const webhookReceiver =
  //           process.env.WEBHOOK_SITE_URL ||
  //           "https://webhook.site/87992418-3f4c-4cf2-8dae-14e256a85678"; //update this

  //         const response = await axios.post(
  //           webhookReceiver,
  //           {
  //             ...payload,
  //             method: "axios",
  //             sheets,
  //             records,
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         if (response.status === 200) {
  //           await api.jobs.complete(jobId, {
  //             outcome: {
  //               message:
  //                 "Data was successfully submitted to webhook.site. Go check it out at " +
  //                 webhookReceiver +
  //                 ".",
  //             },
  //           });
  //         } else {
  //           throw new Error("Failed to submit data to webhook.site");
  //         }
  //       } catch (error) {
  //         console.log(`webhook.site[error]: ${JSON.stringify(error, null, 2)}`);

  //         await api.jobs.fail(jobId, {
  //           outcome: {
  //             message:
  //               "This job failed probably because it couldn't find the webhook.site URL.",
  //           },
  //         });
  //       }
  //     }
  //   );
  // });
}
