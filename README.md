# Buy Me Coffee - Sui Move Smart Contract

A decentralized "Buy Me Coffee" tipping platform built on Sui blockchain using Move language. Users can send tips (SUI) to creators with optional messages.

## Features

- ✅ Send tips with SUI tokens
- ✅ Include messages with tips
- ✅ Track total tips received
- ✅ Track number of tippers
- ✅ View tip history
- ✅ Event emission for on-chain tracking
- ✅ Fully tested and ready to deploy

## Project Structure

```
sui_buy_me_coffee/
├── Move.toml              # Package configuration
├── sources/
│   └── sui_buy_me_coffee.move  # Main smart contract
└── tests/
    └── sui_buy_me_coffee_tests.move  # Test suite
```

## Prerequisites

1. **Install Sui CLI**: Follow the [official Sui installation guide](https://docs.sui.io/build/install)
2. **Set up Sui wallet**: Create or import a wallet
3. **Get testnet tokens**: Request testnet SUI from the faucet

## Building the Project

```bash
# Build the project
sui move build

# Run tests
sui move test
```

## Deployment

### Deploy to Testnet

1. **Set up your environment**:
   ```bash
   # Switch to testnet
   sui client switch --env testnet
   
   # Check your active address
   sui client active-address
   ```

2. **Publish the package**:
   ```bash
   sui client publish --gas-budget 100000000
   ```

3. **Save the package ID**: After deployment, you'll receive a package ID. Save this for future reference.

4. **Initialize the contract**:
   ```bash
   # The init function will be called automatically on deployment
   # The BuyMeCoffee object will be created as a shared object
   ```

### Deploy to Mainnet

1. **Switch to mainnet**:
   ```bash
   sui client switch --env mainnet
   ```

2. **Publish** (ensure you have enough SUI for gas):
   ```bash
   sui client publish --gas-budget 100000000
   ```

## Usage

### Sending a Tip

To send a tip to a creator, call the `buy_coffee` function:

```move
buy_coffee(
    buy_me_coffee: &mut BuyMeCoffee,
    payment: Coin<SUI>,
    message: vector<u8>,
    ctx: &mut TxContext,
)
```

**Parameters:**
- `buy_me_coffee`: The shared BuyMeCoffee object ID
- `payment`: A Coin<SUI> containing the tip amount
- `message`: A byte vector containing your message (can be empty)
- `ctx`: Transaction context (automatically provided)

### Viewing Stats

Use the getter functions to view statistics:

- `total_tips_received(buy_me_coffee: &BuyMeCoffee): u64` - Total SUI received
- `total_tippers(buy_me_coffee: &BuyMeCoffee): u64` - Number of unique tippers
- `tip_count(buy_me_coffee: &BuyMeCoffee): u64` - Total number of tips
- `creator(buy_me_coffee: &BuyMeCoffee): address` - Creator's address
- `get_tip(buy_me_coffee: &BuyMeCoffee, index: u64): (address, u64, vector<u8>, u64)` - Get tip details by index

## Events

The contract emits two types of events:

1. **CoffeeTip**: Emitted when a tip is received
   - `sender`: Address of the tipper
   - `amount`: Amount of SUI sent
   - `message`: Message from tipper
   - `timestamp`: Transaction timestamp

2. **CoffeeStats**: Emitted when stats are updated
   - `total_tips`: Cumulative total of tips
   - `total_tippers`: Number of unique tippers

## Example: Using with Sui CLI

```bash
# Get the BuyMeCoffee object ID (from deployment or query)
BUY_ME_COFFEE_ID="0x..."

# Create a payment coin (example: 1000 MIST = 0.001 SUI)
sui client split-coin --amounts 1000 --gas-budget 10000000

# Call buy_coffee function
sui client call \
  --function buy_coffee \
  --module sui_buy_me_coffee \
  --package <PACKAGE_ID> \
  --args <BUY_ME_COFFEE_ID> <PAYMENT_COIN_ID> "Hello, great work!" \
  --gas-budget 10000000
```

## Integration with Frontend

To integrate with a frontend application:

1. Use the [Sui TypeScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk/typescript)
2. Connect user wallets (Sui Wallet, Ethos, etc.)
3. Call the `buy_coffee` function using `signAndExecuteTransactionBlock`
4. Listen for events to update UI in real-time

Example TypeScript snippet:

```typescript
import { TransactionBlock } from '@mysten/sui.js';

const tx = new TransactionBlock();
tx.moveCall({
  target: `${PACKAGE_ID}::sui_buy_me_coffee::buy_coffee`,
  arguments: [
    tx.object(BUY_ME_COFFEE_ID),
    paymentCoin,
    tx.pure(Array.from(new TextEncoder().encode(message))),
  ],
});

await signAndExecuteTransactionBlock({ transactionBlock: tx });
```

## Security Considerations

- ✅ Input validation (amount must be > 0)
- ✅ Shared object pattern for concurrent access
- ✅ Direct transfer to creator (no intermediate storage)
- ✅ Immutable creator address

## Testing

Run the test suite:

```bash
sui move test
```

The test suite includes:
- Initialization tests
- Single tip functionality
- Multiple tips functionality
- Error handling (zero amount, invalid index)

## License

This project is open source and available for use.

## Support

For issues or questions:
- Check [Sui Documentation](https://docs.sui.io)
- Visit [Sui Discord](https://discord.gg/sui)
- Review [Sui Forum](https://forums.sui.io)

---

**Ready to deploy!** 🚀

