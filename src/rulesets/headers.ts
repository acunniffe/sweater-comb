import { SnykApiCheckDsl } from '../dsl';
const { expect } = require('chai');

export const rules = {
  headerNameCase: ({ responses }: SnykApiCheckDsl) => {
    responses.headers.requirement.must('be kebab case', ({ name }) => {
      const kebabCase = /^[a-z]+(-[a-z]+)+$/g;
      expect(kebabCase.test(name)).to.be.true;
    });
  },
};
