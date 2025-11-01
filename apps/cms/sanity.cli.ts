// apps/cms/sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: '你的projectId', dataset: 'production'}
})
