/**
 * This code is used in Flatfile's Custom App Tutorial
 * https://flatfile.com/docs/apps/custom
 *
 * To see all of Flatfile's code examples go to: https://github.com/FlatFilers/flatfile-docs-kitchen-sink
 */

import api from "@flatfile/api";
import { recordHook } from "@flatfile/plugin-record-hook";

// TODO: Update this with your webhook.site URL for Part 4
const webhookReceiver = "https://webhook.site/1234";

export default function (listener) {
  // Part 1: Setup a listener (https://flatfile.com/docs/apps/custom/meet-the-listener)
  listener.on("**", (event) => {
    // Log all events
    console.log(`Received event: ${event.topic}`);
  });

  listener.namespace(["space:nikfiles"], (nikfiles) => {
    // Part 2: Configure a Space (https://flatfile.com/docs/apps/custom)
    nikfiles.on(
      "job:ready",
      { job: "space:configure" },
      async ({ context: { spaceId, environmentId, jobId } }) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Gettin started.",
            progress: 10,
          });

          await api.workbooks.create({
            spaceId,
            environmentId,
            name: "All Data",
            labels: ["pinned"],
            sheets: [
              {
                name: "Desired Output",
                slug: "ouput",
                fields: [
                  {
                    key: "product_type",
                    type: "string",
                    label: "Product Type",
                  },
                  {
                    key: "product_group",
                    type: "string",
                    label: "Product Group",
                  },
                  {
                    key: "product_id",
                    type: "string",
                    label: "Product",
                  },
                  {
                    key: "ship_to_city",
                    type: "string",
                    label: "Ship to City",
                  },
                  {
                    key: "customer_branch",
                    type: "string",
                    label: "Customer Branch",
                  },
                  {
                    key: "channel",
                    type: "string",
                    label: "Channel",
                  },
                  {
                    key: "date",
                    type: "string",
                    label: "Date",
                  },
                  {
                    key: "quantity_sold",
                    type: "number",
                    label: "Quantity Sold",
                  },
                  {
                    key: "time_bucket",
                    type: "string",
                    label: "Time Bucket",
                  },
                  {
                    key: "revenue",
                    type: "number",
                    label: "Revenue",
                  },
                ],
              },
            ],
            actions: [
              {
                operation: "submitAction",
                mode: "foreground",
                label: "Submit Data",
                description: "Submit data to webhook.site",
                primary: true,
              },
            ],
          });

          await api.documents.create(spaceId, {
            title: "Getting Started",
            body:
              "# Welcome\n" +
              "### Say hello to your first customer Space in the new Flatfile!\n" +
              "Let's begin by first getting acquainted with what you're seeing in your Space initially.\n" +
              "---\n",
          });

          await api.spaces.update(spaceId, {
            environmentId,
            metadata: {
              theme: {
                root: {
                  primaryColor: "black",
                },
                sidebar: {
                  backgroundColor: "#202020",
                  textColor: "white",
                },
                // See reference for all possible variables
              },
            },
          });

          await api.jobs.complete(jobId, {
            outcome: {
              message: "Your Space was created.",
              acknowledge: true,
            },
          });
        } catch (error) {
          console.error("Error:", error.stack);

          await api.jobs.fail(jobId, {
            outcome: {
              message: "Creating a Space encountered an error. See Event Logs.",
              acknowledge: true,
            },
          });
        }
      }
    );

    // Part 3: Transform and validate (https://flatfile.com/docs/apps/custom/add-data-transformation)
    nikfiles.use(
      recordHook("output", (record) => {
        // Validate and transform a Record's date field
        const moment = require("moment");
        const date = record.get("date");

        function convertToUTC(dateString) {
          const formats = ["MM/DD/YYYY", "DD/MM/YYYY"];
          const utcDate = moment(dateString, formats, true).utc().toISOString();
          return utcDate;
        }

        if (typeof date === "string") {
          record.set("date", convertToUTC(date));
        } else {
          record.addError("date", "Please enter a valid date here");
        }

        return record;
      })
    );

    // Part 4: Configure a submit Action (https://flatfile.com/docs/apps/custom/submit-action)
    nikfiles.on(
      "job:ready",
      { job: "workbook:submitAction" },
      async (event) => {
        const { payload } = event;
        const { jobId, workbookId } = event.context;

        // Acknowledge the job
        try {
          await api.jobs.ack(jobId, {
            info: "Starting job to submit action to webhook.site",
            progress: 10,
          });

          // Collect all Sheet and Record data from the Workbook
          const { data: sheets } = await api.sheets.list({ workbookId });
          const records = {};
          for (const [index, element] of sheets.entries()) {
            records[`Sheet[${index}]`] = await api.records.get(element.id);
          }

          console.log(JSON.stringify(records, null, 2));

          // Send the data to our webhook.site URL
          const response = await fetch(webhookReceiver, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...payload,
              method: "fetch",
              sheets,
              records,
            }),
          });

          // If the call fails throw an error
          if (response.status !== 200) {
            throw new Error("Failed to submit data to webhook.site");
          }

          // Otherwise, complete the job
          await api.jobs.complete(jobId, {
            outcome: {
              message: `Data was successfully submitted to Webhook.site. Go check it out at ${webhookReceiver}.`,
            },
          });
        } catch (error) {
          // If an error is thrown, fail the job
          console.log(`webhook.site[error]: ${JSON.stringify(error, null, 2)}`);
          await api.jobs.fail(jobId, {
            outcome: {
              message: `This job failed. Check your ${webhookReceiver}.`,
            },
          });
        }
      }
    );
  });
}
