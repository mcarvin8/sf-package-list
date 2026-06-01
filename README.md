# sf-package-list

[![NPM](https://img.shields.io/npm/v/sf-package-list.svg?label=sf-package-list)](https://www.npmjs.com/package/sf-package-list)
[![Downloads/week](https://img.shields.io/npm/dw/sf-package-list.svg)](https://npmjs.org/package/sf-package-list)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
[![Maintainability](https://qlty.sh/badges/3f1779cc-038e-48f0-b693-52f72e106d67/maintainability.svg)](https://qlty.sh/gh/mcarvin8/projects/sf-package-list)
[![codecov](https://codecov.io/gh/mcarvin8/sf-package-list/graph/badge.svg?token=SAT4HZCEHU)](https://codecov.io/gh/mcarvin8/sf-package-list)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fmcarvin8%2Fsf-package-list%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/mcarvin8/sf-package-list/main)

Salesforce CLI plugin to convert `package.xml` files to a human-readable list format—and back.

---

## Install

```bash
sf plugins install sf-package-list
```

---

## List Format

Each metadata type gets one line: `TypeName: member1, member2, ...`

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

## Commands

### `sf sfpl list` — package.xml → list

```bash
sf sfpl list -x <package.xml> [-l <output.txt>] [-n]
```

| Flag               | Short | Default       | Description                      |
| ------------------ | ----- | ------------- | -------------------------------- |
| `--package-xml`    | `-x`  | —             | Path to the source `package.xml` |
| `--package-list`   | `-l`  | `package.txt` | Output path for the list file    |
| `--no-api-version` | `-n`  | `false`       | Omit API version from output     |

### `sf sfpl xml` — list → package.xml

```bash
sf sfpl xml -l <list.txt> [-x <package.xml>] [-n]
```

| Flag               | Short | Default       | Description                                 |
| ------------------ | ----- | ------------- | ------------------------------------------- |
| `--package-list`   | `-l`  | —             | Path to the source list file                |
| `--package-xml`    | `-x`  | `package.xml` | Output path for the generated `package.xml` |
| `--no-api-version` | `-n`  | `false`       | Omit API version from output                |

---

## Use Cases

- **CI/CD pipelines** — list format is easier to diff, review, and edit than XML
- **sfdx-git-delta workflows** — paste metadata lists into MR descriptions or CI variables instead of raw XML
- **Destructive deployments** — build a list, convert to `destructiveChanges.xml`

---

## Troubleshooting

**Invalid `package.xml`** — Errors from `@salesforce/source-deploy-retrieve` (unknown types, parse failures) surface as warnings and produce empty output. If a type is unrecognized, the SDR version bundled with this plugin may predate that metadata type; upgrading the plugin may resolve it.

**Invalid list lines** — Each malformed line is skipped with a warning. Valid lines still produce output.

The plugin never throws on bad input—it warns and continues.

---

## Issues

Found a bug or have a feature request? [Open an issue](https://github.com/mcarvin8/sf-package-list/issues).

---

## License

[MIT](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
