# sf-package-list

[![NPM](https://img.shields.io/npm/v/sf-package-list.svg?label=sf-package-list)](https://www.npmjs.com/package/sf-package-list)
[![Downloads/week](https://img.shields.io/npm/dw/sf-package-list.svg)](https://npmjs.org/package/sf-package-list)
[![GitHub Marketplace](https://img.shields.io/badge/marketplace-sf--package--list-blue?logo=github)](https://github.com/marketplace/actions/sf-package-list)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
[![codecov](https://codecov.io/gh/mcarvin8/sf-package-list/graph/badge.svg?token=SAT4HZCEHU)](https://codecov.io/gh/mcarvin8/sf-package-list)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fmcarvin8%2Fsf-package-list%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/mcarvin8/sf-package-list/main)

Convert Salesforce `package.xml` manifests to and from a human-readable list format. Available as a **Salesforce CLI plugin** for any provider, and as a **native GitHub Action** for GitHub Actions users who want to skip installing the CLI.

- [List Format](#list-format)
- [Salesforce CLI](#salesforce-cli)
  - [Requirements](#requirements)
  - [Install](#install)
  - [`sf sfpl list`](#sf-sfpl-list)
  - [`sf sfpl xml`](#sf-sfpl-xml)
- [GitHub Action](#github-action)
  - [Passing Text Instead of Files](#passing-text-instead-of-files)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
- [Programmatic API](#programmatic-api)
- [Use Cases](#use-cases)
  - [CI/CD Pipelines](#cicd-pipelines)
  - [Controlled Destructive Deployments](#controlled-destructive-deployments)
  - [Pipeline-Driven Metadata Selection](#pipeline-driven-metadata-selection)
  - [Release Management and Change Review](#release-management-and-change-review)
  - [Metadata-as-Data Automation](#metadata-as-data-automation)
  - [Documentation and Communication](#documentation-and-communication)
- [Troubleshooting](#troubleshooting)
- [Issues](#issues)
- [License](#license)

---

## List Format

Each metadata type gets one line: `TypeName: member1, member2, ...`

Optionally, API version gets exactly one line: `Version: 59.0`

```
CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold
CustomObject: ABC, Glengarry, Mitch_And_Murray
CustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c
EmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives
StandardValueSet: Glengarry_Leads, Cadillac_Eldorado
Version: 59.0
```

<details>
<summary>Equivalent package.xml</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>Always_Be_Closing</members>
        <members>Attention_Interest_Decision_Action</members>
        <members>Leads_Are_Gold</members>
        <name>CustomLabel</name>
    </types>
    <types>
        <members>ABC</members>
        <members>Glengarry</members>
        <members>Mitch_And_Murray</members>
        <name>CustomObject</name>
    </types>
    <types>
        <members>Glengarry.Weak_Leadz__c</members>
        <members>Coffee.is_Closer__c</members>
        <name>CustomField</name>
    </types>
    <types>
        <members>unfiled$public/Second_Prize_Set_of_Steak_Knives</members>
        <name>EmailTemplate</name>
    </types>
    <types>
        <members>Glengarry_Leads</members>
        <members>Cadillac_Eldorado</members>
        <name>StandardValueSet</name>
    </types>
    <version>59.0</version>
</Package>
```

</details>

---

## Salesforce CLI

### Requirements

- Salesforce CLI (`sf`)
- Node.js **22.19 or later**

### Install

```bash
sf plugins install sf-package-list
```

### Commands

<!-- commands -->
* [`sf sfpl list`](#sf-sfpl-list)
* [`sf sfpl xml`](#sf-sfpl-xml)

## `sf sfpl list`

Convert a Salesforce package into list format.

```
USAGE
  $ sf sfpl list [--json] [--flags-dir <value>] [-x <value>] [-l <value>] [-n] [--fail-on-empty]

FLAGS
  -l, --package-list=<value>  [default: package.txt] Output path to save the package list to.
  -n, --no-api-version        Intentionally omit the API version in the package list.
  -x, --package-xml=<value>   Path to the package.xml to convert to list format.
      --fail-on-empty         Fail the command if the package list is empty (e.g. the input package.xml was invalid,
                              missing, or empty).

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Convert a Salesforce package into list format.

  Read a package.xml file and convert it to list format.

EXAMPLES
  $ sf sfpl list -x package.xml

  $ sf sfpl list -x package.xml -n

  $ sf sfpl list -x package.xml --fail-on-empty
```

_See code: [src/commands/sfpl/list.ts](https://github.com/mcarvin8/sf-package-list/blob/v3.4.0/src/commands/sfpl/list.ts)_

## `sf sfpl xml`

Convert a Salesforce package list back into a XML.

```
USAGE
  $ sf sfpl xml [--json] [--flags-dir <value>] [-x <value>] [-l <value>] [-n] [--fail-on-empty]

FLAGS
  -l, --package-list=<value>  Text file containing the package list to convert into an XML.
  -n, --no-api-version        Intentionally omit the API version in the package.xml.
  -x, --package-xml=<value>   [default: package.xml] Path to the package.xml to create.
      --fail-on-empty         Fail the command if the generated package.xml has no <types> (e.g. the input package list
                              was invalid or empty).

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Convert a Salesforce package list back into a XML.

  Convert the package list back into a package.xml.

EXAMPLES
  $ sf sfpl xml -l list.txt -x package.xml

  $ sf sfpl xml -l list.txt -x package.xml -n

  $ sf sfpl xml -l list.txt -x package.xml --fail-on-empty
```

_See code: [src/commands/sfpl/xml.ts](https://github.com/mcarvin8/sf-package-list/blob/v3.4.0/src/commands/sfpl/xml.ts)_
<!-- commandsstop -->

---

## GitHub Action

For GitHub Actions, this is also available as a native Action — no `sf` CLI or plugin install required. One action, two `mode`s:

### `mode: to-list` — package.xml → list

```yaml
- name: Convert package.xml to a list
  id: to-list
  uses: mcarvin8/sf-package-list@v3
  with:
    mode: to-list
    package-xml: package.xml
    package-list: package.txt
```

### `mode: to-xml` — list → package.xml

```yaml
- name: Convert a list to package.xml
  id: to-xml
  uses: mcarvin8/sf-package-list@v3
  with:
    mode: to-xml
    package-list: package.txt
    package-xml: package.xml
```

### Passing Text Instead of Files

When an earlier step produces the list or the `package.xml` as text, pass it to `package-list-content` or `package-xml-content`. You don't need to write it to a file first. The output file is still written, and the generated text is also available as the `package-xml` or `package-list` output.

```yaml
- name: Convert a list from an earlier step to package.xml
  id: to-xml
  uses: mcarvin8/sf-package-list@v3
  with:
    mode: to-xml
    package-list-content: ${{ steps.metadata.outputs.list }}
    package-xml: package.xml
    fail-on-empty: true

- name: Deploy
  run: sf project deploy start --manifest "${{ steps.to-xml.outputs.package-xml-path }}"
```

Passing text through `with:` is safer than `run: echo "${{ ... }}" > package.txt`. Text from a PR body or commit message can contain shell syntax that a `run:` step would execute.

Use either the content input or the matching path input as the source, not both. An empty content value counts as not provided. GitHub limits step outputs to 1 MB per job, which is well above the size of real manifests.

### Inputs

| Input             | Description                                                                                                     | Required | Default        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | -------- | -------------- |
| `mode`               | Conversion direction: `to-list` (package.xml → list) or `to-xml` (list → package.xml).                             | **Yes**  |                 |
| `package-xml`        | `to-list`: source `package.xml`. `to-xml`: output path for the generated `package.xml`.                            | No       | `package.xml`   |
| `package-list`       | `to-list`: output path for the generated package list. `to-xml`: source package list.                              | No       | `package.txt`   |
| `package-xml-content` | `to-list` only: `package.xml` text to convert, instead of the `package-xml` file.                                 | No       |                 |
| `package-list-content` | `to-xml` only: package list text to convert, instead of the `package-list` file.                                 | No       |                 |
| `no-api-version` | Omit the API version from the generated package output so Salesforce CLI can apply its [source API version precedence](https://developer.salesforce.com/docs/platform/sfdx-setup/guide/sfdx-setup-apiversion.html#sourceapiversion-order-of-precedence). | No | `false` |
| `fail-on-empty`      | Fail the action if the generated output has no types.                                                             | No       | `false`         |

### Outputs

| Output               | Description                                                                       |
| --------------------- | ------------------------------------------------------------------------------------- |
| `package-list-path`   | Path to the generated package list (`to-list` mode only).                          |
| `package-xml-path`    | Path to the generated `package.xml` (`to-xml` mode only).                          |
| `package-list`        | Text of the generated package list (`to-list` mode only).                          |
| `package-xml`         | Text of the generated `package.xml` (`to-xml` mode only).                          |
| `types`               | Number of distinct metadata types processed.                                       |
| `members`             | Number of members processed.                                                       |
| `api-version`         | API version used in the generated `package.xml` (`to-xml` mode only; empty when omitted). |
| `warnings`            | Newline-separated list of warnings emitted while converting, if any.               |

---

## Programmatic API

The conversion functions are also exported for use from Node.js scripts:

```bash
npm install sf-package-list
```

Convert strings in memory, with no files involved:

```typescript
import { convertListToXml, convertXmlToList } from 'sf-package-list';

// list → package.xml
const { packageXml, warnings, types } = convertListToXml('ApexClass: MyClass\nVersion: 62.0');

// package.xml → list
const { packageList } = convertXmlToList(packageXml, { noApiVersion: true });
```

Or convert files, the same way the CLI does:

```typescript
import { listToPackageXml, packageXmlToList } from 'sf-package-list';

// list file → package.xml file
const { xmlPath, warnings, types } = await listToPackageXml({
  listPath: 'package.txt',
  xmlPath: 'package.xml',
  noApiVersion: false,
});

// package.xml file → list file
const { packageList } = await packageXmlToList({
  xmlPath: 'package.xml',
  listPath: 'package.txt',
  noApiVersion: false,
});
```

| Export               | Description                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `convertListToXml`   | Converts list text to `package.xml` text. Returns `{ packageXml, warnings, types }`.                          |
| `convertXmlToList`   | Converts `package.xml` text to list text. Returns `{ packageList, warnings }`.                                |
| `listToPackageXml`   | Reads a list file and writes a `package.xml`. Returns the output path, warnings, and number of types.        |
| `packageXmlToList`   | Reads a `package.xml` and writes a list file. Returns the list contents and warnings.                        |
| `parseManifestXml`   | Parses a `package.xml` string into `{ types: { name, members }[], version }`. Throws if the XML is invalid.  |

The `convert*` functions take an optional `{ noApiVersion }` (default `false`). Types `ConvertListToXmlResult`, `ConvertXmlToListResult`, `ParsedManifest` and `ParsedManifestType` are exported too.

The convert and file functions do not throw on bad input. Problems come back in `warnings` and the output is empty, the same as the CLI. `parseManifestXml` is the exception: it throws on XML that is not a valid manifest.

Installing the package also installs the plugin's Salesforce CLI dependencies (`@salesforce/core`, `@oclif/core`).

---

## Use Cases

### CI/CD Pipelines

The list format is easier to diff, review, and edit than XML, making it well suited for pull requests, merge requests, deployment approvals, and release workflows.

Because metadata is represented in a concise text format, pipeline logs can clearly show exactly what will be deployed before a deployment step executes.

Example deployment manifest:

```text
CustomObject: Invoice__c
CustomField: Invoice__c.Status__c, Invoice__c.Amount__c
ApexClass: InvoiceController
```

This provides a human-readable deployment summary without requiring reviewers to inspect generated XML.

**Example: print the `sfdx-git-delta` package.xml as a list before deploying**

[`sfdx-git-delta`](https://github.com/scolladon/sfdx-git-delta) generates a `package.xml`/`destructiveChanges.xml` from a git diff. Convert the generated `package.xml` to list format and print it to the job log so reviewers can see exactly what will deploy before the deploy step runs:

```yaml
name: Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli@latest

      - name: Install plugins
        run: |
          echo y | sf plugins install sfdx-git-delta
          echo y | sf plugins install sf-package-list

      - name: Generate delta package.xml
        run: sf sgd source delta --to HEAD --from HEAD^ --output .

      - name: Print deployment manifest as list
        run: sf sfpl list -x package/package.xml

      - name: Authenticate to Salesforce
        run: sf org login sfdx-url --sfdx-url-file ${{ secrets.SFDX_AUTH_URL }} --alias ci-org

      - name: Deploy delta
        run: sf project deploy start -x package/package.xml -o ci-org
```

The `package.txt` printed in the log becomes a quick, reviewable manifest of the deployment—no need to open the generated XML to confirm scope.

### Controlled Destructive Deployments

Use a package list as a restricted allowlist of metadata to remove.

For destructive deployments that should not depend on a committed file or a standard push-triggered pipeline, let an authorized admin supply the package list at runtime through a GitHub Actions `workflow_dispatch` input or a GitLab web-based pipeline form. The pipeline can then convert that approved input into `destructiveChanges.xml` during execution and deploy only the explicitly declared components.

This approach makes destructive changes easier to review and approve, without requiring a raw deletion manifest to live in version control. It also reduces the risk of deleting metadata that was not intentionally approved for removal.

**Example: manual pipeline input (GitHub `workflow_dispatch` or GitLab web form) → `destructiveChanges.xml`**

Accept the list of components to delete as a manual text input, restricting the destructive deployment to exactly what an approver typed in—no free-form XML editing required and no dependency on a checked-in file:

```yaml
name: Destructive Deployment

on:
  workflow_dispatch:
    inputs:
      destructive_list:
        description: 'Components to delete, in package-list format (e.g. "CustomField: Invoice__c.Old_Field__c")'
        required: true
        type: string

jobs:
  destroy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli@latest

      - name: Install plugin
        run: echo y | sf plugins install sf-package-list

      - name: Write approved list to file
        run: printf '%s\n' "${{ github.event.inputs.destructive_list }}" > destructive.txt

      - name: Convert list to destructiveChanges.xml
        run: sf sfpl xml -l destructive.txt -x destructiveChanges.xml -n

      - name: Write empty package.xml required for a standalone destructive deployment
        run: sf sfpl xml -x package.xml -n

      - name: Authenticate to Salesforce
        run: sf org login sfdx-url --sfdx-url-file ${{ secrets.SFDX_AUTH_URL }} --alias ci-org

      - name: Deploy destructive changes
        run: sf project deploy start -x package.xml --post-destructive-changes destructiveChanges.xml -o ci-org
```

GitLab can use the same model: an admin launches a manual pipeline from the web UI, enters the package list as 1 multi-line input variable, and the pipeline converts that input to `destructiveChanges.xml` at runtime. The destruction scope comes only from the approved input, so the deployment is limited to exactly the components an approver declared—nothing picked up implicitly from a branch diff, working directory, or committed manifest.

### Pipeline-Driven Metadata Selection

Store metadata selections in CI variables, deployment parameters, release manifests, or generated artifacts.

The list format is compact enough to be:

- Generated by automation
- Passed between pipeline stages
- Embedded in release tickets
- Stored as deployment manifests alongside source code

and then converted to `package.xml` only when needed.

### Release Management and Change Review

Use package lists as lightweight deployment manifests that can be reviewed by administrators, release managers, and auditors.

The format is intentionally simple enough for non-developers to verify without needing Salesforce metadata XML knowledge:

```text
CustomLabel: Feature_Flag_X
PermissionSet: Sales_User
Flow: Lead_Routing
```

### Metadata-as-Data Automation

Generate deployment manifests programmatically from:

- Change requests
- Ticketing systems
- Environment promotion tools
- Custom release automation
- Internal deployment portals

The resulting list can be transformed into a valid `package.xml` immediately before deployment, allowing automation to work with a simple text representation instead of XML.

### Documentation and Communication

Package lists are easy to paste into:

- Pull requests
- Change requests
- Release notes
- Deployment approvals
- Team chat discussions

This makes it easier to communicate deployment scope than sharing raw `package.xml` files.

---

## Troubleshooting

Manifests and list files are parsed in-house and checked only against *structure*, not against Salesforce's metadata registry. `<name>`/type-name values are taken as-is; a misspelled or nonexistent metadata type will pass through to the output instead of being rejected here—deployment will fail on it later, not here.

**Invalid `package.xml`** — A `<Package>` document that doesn't match the expected Metadata API manifest structure (multiple `<version>`, malformed `<types>`, unexpected elements, etc.) or has no `<types>` surfaces as a warning and produces empty output. The underlying parse error is appended to the warning.

**Invalid list lines** — Each malformed line is skipped with a warning. Valid lines still produce output.

sf-package-list never throws on bad input by default—it warns and continues. If you would like the plugin to throw an error to catch, supply the `fail-on-empty` flag or action input so the plugin returns an error when the generated output is empty (i.e. no metadata types). This is useful as a guard against deploying an empty manifest.

---

## Issues

Found a bug or have a feature request? [Open an issue](https://github.com/mcarvin8/sf-package-list/issues).

---

## License

[MIT](LICENSE.md)
