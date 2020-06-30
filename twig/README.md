## Twig

**Nest.land's Private Arweave API.**

#### What it does?

Handle arweave transactions and other functions as an API service.

#### Upload Flow

1. `Rust API` receives package details and puts its contents in the `tmp` folder.

2. `Twig` gets pinged by the Rust API to process the package contents in `tmp` and upload to the permaweb.

3. It returns the tx_id and upload details back to RustAPI.

4. The RustAPI saves the upload data to database and returns the success status back to the eggs cli(end-user)
