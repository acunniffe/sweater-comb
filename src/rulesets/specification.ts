import { SnykApiCheckDsl } from "../dsl";
import { expect } from "chai";
import { pascalCase } from "change-case";
import { links } from "../docs";

export const rules = {
  componentNameCase: ({ specification }: SnykApiCheckDsl) => {
    specification.requirement.must(
      "use pascal case for component names",
      (spec, context, docs) => {
        docs.includeDocsLink(links.standards.referencedEntities);
        const componentTypes = Object.keys(spec.components || {});
        for (const componentType of componentTypes) {
          const componentNames = Object.keys(
            spec.components?.[componentType] || {},
          );
          for (const componentName of componentNames) {
            expect(pascalCase(componentName)).to.equal(componentName);
          }
        }
      },
    );
  },
  listOpenApiVersions: ({ specification }: SnykApiCheckDsl) => {
    specification.requirement.must(
      "list the available versioned OpenAPI specifications",
      (spec, context, docs) => {
        docs.includeDocsLink(links.standards.openApiVersions);
        if (spec["x-snyk-api-stability"] === undefined) {
          // Only applicable to compiled OAS; resource versions do not need to declare this
          const pathUrls = Object.keys(spec.paths);
          expect(pathUrls).to.include("/openapi");
        }
      },
    );
  },
  getOpenApiVersions: ({ specification }: SnykApiCheckDsl) => {
    specification.requirement.must(
      "provide versioned OpenAPI specifications",
      (spec, context, docs) => {
        docs.includeDocsLink(links.standards.openApiVersions);
        if (spec["x-snyk-api-stability"] === undefined) {
          // Only applicable to compiled OAS; resource versions do not need to declare this
          const pathUrls = Object.keys(spec.paths);
          expect(pathUrls).to.include("/openapi/{version}");
        }
      },
    );
  },
  tags: ({ specification }: SnykApiCheckDsl) => {
    specification.requirement.must(
      "have name and description for tags",
      (spec, context, docs) => {
        docs.includeDocsLink(links.standards.tags);
        const tags = spec.tags || [];
        for (const tag of tags) {
          expect(tag).to.have.property("name");
          expect(tag).to.have.property("description");
        }
      },
    );
  },
};
