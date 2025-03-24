# `sf-package-list`

[![NPM](https://img.shields.io/npm/v/sf-package-list.svg?label=sf-package-list)](https://www.npmjs.com/package/sf-package-list) [![Downloads/week](https://img.shields.io/npm/dw/sf-package-list.svg)](https://npmjs.org/package/sf-package-list) [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mcarvin8/sf-package-list/refs/heads/main/LICENSE.md)

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>

- [Install](#install)
- [Example](#example)
- [Why](#why)
- [Commands](#commands)
  - [`sf-sfpl-list`](#sf-sfpl-list)
  - [`sf-sfpl-xml`](#sf-sfpl-xml)
- [Use Case](#use-case)
- [Issues](#issues)
- [License](#license)
</details>

Convert Salesforce manifest files (`package.xml`) into list format and reverse the process when needed.

## Install

```bash
sf plugins install sf-package-list@x.y.z
```

## Example

**`package.xml`**

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

**Package List**

> Multiple metadata members can be separated by commas or spaces.

```
CustomLabel: Always_Be_Closing, Attention_Interest_Decision_Action, Leads_Are_Gold
CustomObject: ABC, Glengarry, Mitch_And_Murray
CustomField: Glengarry.Weak_Leadz__c, Coffee.is_Closer__c
EmailTemplate: unfiled$public/Second_Prize_Set_of_Steak_Knives
StandardValueSet: Glengarry_Leads, Cadillac_Eldorado
Version: 59.0
```

## Why

The package list format offers several benefits for Salesforce admins and developers:

- **Readability** – The format is much simpler and easier to scan compared to XML, making it quicker to understand which metadata is being deployed or destroyed.
- **Ease of Editing** – Users can easily add, remove, or modify metadata items without worrying about XML syntax or structure.
- **Version Control Friendly** – The format reduces unnecessary diffs in Git since there's no XML nesting, indentation, or attributes that could change subtly.
- **Better for Scripting** – It integrates well with automation scripts, as it's easier to parse with simple text-processing tools compared to XML.
- **Faster Declaration** – Users can quickly list metadata items without dealing with XML formatting, leading to a more efficient workflow.

It's a way to streamline deployments and make metadata management more accessible.

## Commands

<!-- commands -->

- [`sf sfpl list`](#sf-sfpl-list)
- [`sf sfpl xml`](#sf-sfpl-xml)

### `sf sfpl list`

Convert a Salesforce package.xml into list format.

```
USAGE
  $ sf sfpl list [-x <value>] [-l <value>] [-n] [--json]

FLAGS
  -x, --package-xml=<value>     Path to the package.xml to convert to list format.
  -l, --package-list=<value>    Output path to save the package list to.
                                [default: 'package.txt']
  -n, --no-api-version          Intentionally omit the API version in the package list.
                                [default: false]


GLOBAL FLAGS
  --json  Format output as json.

EXAMPLES
  Convert package.xml into list format in a text file.

    $ sf sfpl list -x package.xml -l package.txt

  Convert package.xml into list format in a text file, excluding the API version.

    $ sf sfpl list -x package.xml -l package.txt -n
```

<!-- commandsstop -->

If the provided `package.xml` is invalid or empty (no `<types>`), the plugin will print a warning:

```
The provided package is invalid or has no components. Confirm package is a valid Salesforce package.xml.
```

### `sf sfpl xml`

Convert a package list back into a Salesforce package.xml.

```
USAGE
  $ sf sfpl xml [-x <value>] [-l <value>] [-n] [--json]

FLAGS
  -l, --package-list=<value>    Text file containing the package list to convert into an XML.
  -x, --package-xml=<value>     Path to the package.xml to create.
                                [default: 'package.xml']
  -n, --no-api-version          Intentionally omit the API version in the package.xml.
                                [default: false]

GLOBAL FLAGS
  --json  Format output as json.

EXAMPLES
  Convert the list file back into a Salesforce package.xml

    $ sf sfpl xml -x package.xml -l package.txt

  Convert the list file back into a Salesforce package.xml, excluding the API version

    $ sf sfpl xml -x package.xml -l package.txt -n
```

<!-- commandsstop -->

If the provided package list contains invalid lines (i.e. a line missing a colon `:`), the plugin will print a warning for each invalid line and skip the line:

```
Line does not match expected package list format and will be skipped: ${line}
```

## Use Case

In my use case, we use `sfdx-git-delta` to create incremental packages via the git diff, but we also allow the developers to declare additional metadata to deploy via the GitLab merge request description/commit message. Instead of requiring developers to copy and paste a `package.xml` into the description, which may cause errors if XML formatting is off, we use this package list format to provide a simpler way to declare metadata without needing to conform to the XML schema.

We also use this package list format to run destructive deployments from a GitLab web-based pipeline (created by using the "Run pipeline" button in the GitLab UI). The user provides the package list as the job-specific CI/CD variable and the plugin converts this list into the `destructiveChanges.xml`.

## Issues

If you encounter any issues or would like to suggest features, please create an [issue](https://github.com/mcarvin8/sf-package-list/issues).

## License

This project is licensed under the MIT license. Please see the [LICENSE](https://raw.githubusercontent.com/mcarvin8/sf-package-list/main/LICENSE.md) file for details.
