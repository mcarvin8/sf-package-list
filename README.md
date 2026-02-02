# sf-package-list

[![NPM](https://img.shields.io/npm/v/sf-package-list.svg?label=sf-package-list)](https://www.npmjs.com/package/sf-package-list)
[![Downloads/week](https://img.shields.io/npm/dw/sf-package-list.svg)](https://npmjs.org/package/sf-package-list)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
[![Maintainability](https://qlty.sh/badges/3f1779cc-038e-48f0-b693-52f72e106d67/maintainability.svg)](https://qlty.sh/gh/mcarvin8/projects/sf-package-list)
[![Code Coverage](https://qlty.sh/badges/3f1779cc-038e-48f0-b693-52f72e106d67/test_coverage.svg)](https://qlty.sh/gh/mcarvin8/projects/sf-package-list)

A Salesforce CLI plugin that helps you convert `package.xml` files to a simple, human-readable list format—and back again.

This makes working with metadata easier for admins and developers, especially in version control systems, automation pipelines, or anywhere you want to quickly review or edit what's being deployed.

---

## Install

```bash
sf plugins install sf-package-list
```

---

## What It Does

This plugin lets you:

- Convert a Salesforce `package.xml` to a cleaner, flat **package list**
- Convert a **package list** back into a valid `package.xml`

Both directions are supported. The list format uses `TypeName: member1, member2` per line—easy to read, edit, and diff. No XML knowledge required. Works well with version control and CI/CD pipelines.

---

## Examples

<details>
<summary>package.xml (click to expand)</summary>

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

### Package List

> Separate multiple metadata members using a comma.

```
CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold
CustomObject: ABC, Glengarry, Mitch_And_Murray
CustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c
EmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives
StandardValueSet: Glengarry_Leads, Cadillac_Eldorado
Version: 59.0
```

---

## Commands

| Command                                            | Description                |
| -------------------------------------------------- | -------------------------- |
| `sf sfpl list -x package.xml [-l output.txt] [-n]` | Convert package.xml → list |
| `sf sfpl xml -l list.txt [-x package.xml] [-n]`    | Convert list → package.xml |

**Flags:** `-x` / `--package-xml` — path to package.xml. `-l` / `--package-list` — path to list file. `-n` / `--no-api-version` — exclude API version from output.

**Quick start:**

```bash
sf sfpl list -x package.xml -l package.txt
sf sfpl xml -l package.txt -x package.xml
```

---

## Troubleshooting

- **Invalid package.xml** — When converting package.xml to list format, any errors from `@salesforce/source-deploy-retrieve` (e.g. unknown metadata types, parse errors) are included in the warning message. You'll get a warning and empty output; confirm the file is valid or check the warning for SDR details.
- **Invalid list lines** — Each invalid line is skipped with a warning showing the line content. Output continues for valid lines.

The plugin does not fail on invalid or missing inputs; it produces empty output instead.

Note: A missing metadata type definition can also occur if the type is newer than the @salesforce/source-deploy-retrieve version bundled with this plugin. Upgrading the plugin may resolve the issue for newly released metadata types.

---

## Use Case

Works well with `sfdx-git-delta` and CI/CD. Instead of copying `package.xml`, developers can paste metadata in list format—e.g., in merge request descriptions or CI variables. Also useful for destructive deployments: paste a list into a form field and convert to `destructiveChanges.xml`.

---

## Issues

Found a bug or have an idea? [Open an issue](https://github.com/mcarvin8/sf-package-list/issues).

---

## License

[MIT](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
