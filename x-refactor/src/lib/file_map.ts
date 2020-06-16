export interface FileMap {
  [fileName: string]: {
    // In manifest is just the file name.
    inManifest: string;
    txId: string;
  };
}
