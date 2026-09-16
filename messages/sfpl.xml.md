# summary

Convert a Salesforce package list back into a XML.

# description

Convert the package list back into a package.xml.

# examples

- sf sfpl xml -l list.txt -x package.xml
- sf sfpl xml -l list.txt -x package.xml -n
- sf sfpl xml -l list.txt -x package.xml --fail-on-empty

# flags.package-xml.summary

Path to the package.xml to create.

# flags.package-list.summary

Text file containing the package list to convert into an XML.

# flags.no-api-version.summary

Intentionally omit the API version in the package.xml.

# flags.fail-on-empty.summary

Fail the command if the generated package.xml has no <types> (e.g. the input package list was invalid or empty).
