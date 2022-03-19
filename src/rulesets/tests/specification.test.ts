import { rules } from "../specification";
import { SynkApiCheckContext } from "../../dsl";

import { createSnykTestFixture } from "./fixtures";
import { OpenAPIV3 } from "@useoptic/openapi-utilities";
const { compare } = createSnykTestFixture();

const emptyContext: SynkApiCheckContext = {
  changeDate: "2021-10-10",
  changeResource: "Example",
  changeVersion: {
    date: "2021-10-10",
    stability: "ga",
  },
  resourceVersions: {},
};

const baseOpenAPI: OpenAPIV3.Document = {
  openapi: "3.0.1",
  paths: {
    "/example": {
      get: {
        responses: {
          "200": {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    // links: { $ref: "#/components/x-snyk-common/schemas/Links" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  info: { version: "0.0.0", title: "OpenAPI" },

  components: {
    // @ts-ignore
    "x-snyk-common": {
      $ref: "https://raw.githubusercontent.com/snyk/sweater-comb/common-model-v1/components/common.yaml",
    },
    schemas: {
      HelloWorld: {
        type: "object",
      },
    },
  },
};

it("allows non-snake case if already in spec", async () => {
  const result = await compare(baseOpenAPI)
    .to((s) => s)
    .withRule(rules.componentNameCase, emptyContext);

  expect(result.results);
  expect(result).toMatchSnapshot();
});
