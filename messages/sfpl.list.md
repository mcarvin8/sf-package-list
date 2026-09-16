# summary

Convert a Salesforce package into list format.

# description

Read a package.xml file and convert it to list format.

# examples

- sf sfpl list -x package.xml
- sf sfpl list -x package.xml -n
- sf sfpl list -x package.xml --fail-on-empty

# flags.package-xml.summary

Path to the package.xml to convert to list format.

# flags.package-list.summary

Output path to save the package list to.

# flags.no-api-version.summary

Intentionally omit the API version in the package list.

# flags.fail-on-empty.summary

Fail the command if the package list is empty (e.g. the input package.xml was invalid, missing, or empty).
