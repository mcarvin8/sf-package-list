# `sf-package-list`

[![NPM](https://img.shields.io/npm/v/sf-package-list.svg?label=sf-package-list)](https://www.npmjs.com/package/sf-package-list)
[![Downloads/week](https://img.shields.io/npm/dw/sf-package-list.svg)](https://npmjs.org/package/sf-package-list)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md)
[![Maintainability](https://qlty.sh/badges/3f1779cc-038e-48f0-b693-52f72e106d67/maintainability.svg)](https://qlty.sh/gh/mcarvin8/projects/sf-package-list)
[![Code Coverage](https://qlty.sh/badges/3f1779cc-038e-48f0-b693-52f72e106d67/test_coverage.svg)](https://qlty.sh/gh/mcarvin8/projects/sf-package-list)
[![Known Vulnerabilities](https://snyk.io//test/github/mcarvin8/sf-package-list/badge.svg?targetFile=package.json)](https://snyk.io//test/github/mcarvin8/sf-package-list?targetFile=package.json)

A Salesforce CLI plugin that helps you convert `package.xml` files to a simple, human-readable list format—and back again.

This makes working with metadata easier for admins and developers, especially in version control systems, automation pipelines, or anywhere you want to quickly review or edit what’s being deployed.

---

<details>
  <summary>Table of Contents</summary>

- [Install](#install)
- [What It Does](#what-it-does)
- [Why Use It?](#why-use-it)
- [Examples](#examples)
- [Commands](#commands)
  - [`sf sfpl list`](#sf-sfpl-list)
  - [`sf sfpl xml`](#sf-sfpl-xml)
- [Use Case](#use-case)
- [Issues](#issues)
- [License](#license)
</details>

---

## Install

```bash
sf plugins install sf-package-list@x.y.z
```

---

## What It Does

This plugin lets you:

- Convert a Salesforce `package.xml` to a cleaner, flat **package list**
- Convert a **package list** back into a valid `package.xml`

Both directions are supported so you can go back and forth easily.

---

## Why Use It?

Salesforce `package.xml` files can be verbose and tricky to edit manually. This tool simplifies that by providing a flat list format that’s:

- **Easy to Read** – You can quickly scan and understand what metadata is included.
- **Easy to Edit** – Add, remove, or change metadata items without worrying about XML syntax.
- **Git-Friendly** – Cleaner diffs and fewer merge conflicts.
- **Script-Friendly** – Perfect for CI/CD and automation pipelines.
- **Admin-Friendly** – No XML knowledge required to contribute to or understand metadata lists.

---

## Examples

### `package.xml`

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

### Package List

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

### `sf sfpl list`

Convert a `package.xml` to a flat list format.

```
USAGE
  $ sf sfpl list [-x <value>] [-l <value>] [-n] [--json]

FLAGS
  -x, --package-xml=<value>     Path to the package.xml to convert.
  -l, --package-list=<value>    Where to save the converted list. [default: package.txt]
  -n, --no-api-version          Exclude API version from the output. [default: false]

GLOBAL FLAGS
  --json                        Format output as JSON.

EXAMPLES

  Convert and save list format:
  $ sf sfpl list -x package.xml -l package.txt

  Convert and exclude API version:
  $ sf sfpl list -x package.xml -l package.txt -n
```

If the provided `package.xml` is invalid or has no components, you’ll see:

```
The provided package is invalid or has no components. Confirm package is a valid Salesforce package.xml.
```

---

### `sf sfpl xml`

Convert a package list back into a `package.xml`.

```
USAGE
  $ sf sfpl xml [-x <value>] [-l <value>] [-n] [--json]

FLAGS
  -l, --package-list=<value>    Path to the package list file.
  -x, --package-xml=<value>     Where to save the generated package.xml. [default: package.xml]
  -n, --no-api-version          Exclude API version from the generated XML. [default: false]

GLOBAL FLAGS
  --json                        Format output as JSON.

EXAMPLES

  Convert list to package.xml:
  $ sf sfpl xml -x package.xml -l package.txt

  Convert list to package.xml without API version:
  $ sf sfpl xml -x package.xml -l package.txt -n
```

Invalid lines in the list will be skipped with a warning like:

```
Line does not match expected package list format and will be skipped: ${line}
```

---

## Use Case

We use this plugin alongside `sfdx-git-delta` to build deployment packages from git diffs. But we also let developers specify extra metadata via GitLab merge request descriptions or commit messages.

Instead of copying and pasting a `package.xml` (which is error-prone), they can just list the metadata in this simple format. It’s faster, cleaner, and works well with automation.

We also use this format to support destructive deployments triggered from GitLab’s web UI. Users can input a package list into a form field (CI/CD variable), and this plugin turns it into a `destructiveChanges.xml`.

---

## Issues

Found a bug or have an idea? [Open an issue](https://github.com/mcarvin8/sf-package-list/issues).

---

## License

This project is licensed under the [MIT License](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md).
