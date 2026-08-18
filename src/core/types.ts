export type SfPackageListResult = {
  list: string;
};

export type SfPackageXmlResult = {
  path: string;
};

export type PackageManifestObject = {
  Package: {
    '@_xmlns': string;
    types: Array<{ name: string; members: string[] }>;
    version: string | undefined;
  };
};
