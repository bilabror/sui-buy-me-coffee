/// Module: sui_buy_me_coffee
/// A decentralized "Buy Me Coffee" tipping platform on Sui
/// Users can send tips (SUI) to the creator with optional messages
module sui_buy_me_coffee::sui_buy_me_coffee;

use sui::coin::Coin;
use sui::sui::SUI;

/// Error codes
const EInvalidAmount: u64 = 1;

/// CoffeeTip event emitted when someone sends a tip
public struct CoffeeTip has copy, drop {
    sender: address,
    amount: u64,
    message: vector<u8>,
    timestamp: u64,
}

/// CoffeeStats event emitted when stats are updated
public struct CoffeeStats has copy, drop {
    total_tips: u64,
    total_tippers: u64,
}

/// The main BuyMeCoffee object that stores the creator's information and stats
public struct BuyMeCoffee has key {
    id: sui::object::UID,
    creator: address,
    total_tips_received: u64,
    total_tippers: u64,
    tips: vector<Tip>,
}

/// Individual tip record
public struct Tip has store {
    sender: address,
    amount: u64,
    message: vector<u8>,
    timestamp: u64,
}

/// Initialize a new BuyMeCoffee object for a creator
fun init(ctx: &mut TxContext) {
    let creator = sui::tx_context::sender(ctx);
    let buy_me_coffee = BuyMeCoffee {
        id: sui::object::new(ctx),
        creator,
        total_tips_received: 0,
        total_tippers: 0,
        tips: vector::empty(),
    };
    
    // Transfer ownership to the creator
    sui::transfer::share_object(buy_me_coffee);
    
    sui::event::emit(CoffeeStats {
        total_tips: 0,
        total_tippers: 0,
    });
}

/// Send a tip to the creator with an optional message
public fun buy_coffee(
    buy_me_coffee: &mut BuyMeCoffee,
    payment: Coin<SUI>,
    message: vector<u8>,
    ctx: &mut TxContext,
) {
    let amount = sui::coin::value(&payment);
    
    // Validate amount is greater than 0
    assert!(amount > 0, EInvalidAmount);
    
    let sender = sui::tx_context::sender(ctx);
    let timestamp = sui::tx_context::epoch_timestamp_ms(ctx);
    
    // Store message for event before moving it
    let message_copy = *&message;
    
    // Create tip record
    let tip = Tip {
        sender,
        amount,
        message,
        timestamp,
    };
    
    // Update stats
    buy_me_coffee.total_tips_received = buy_me_coffee.total_tips_received + amount;
    buy_me_coffee.total_tippers = buy_me_coffee.total_tippers + 1;
    vector::push_back(&mut buy_me_coffee.tips, tip);
    
    // Transfer payment to creator
    sui::transfer::public_transfer(payment, buy_me_coffee.creator);
    
    // Emit event
    sui::event::emit(CoffeeTip {
        sender,
        amount,
        message: message_copy,
        timestamp,
    });
    
    sui::event::emit(CoffeeStats {
        total_tips: buy_me_coffee.total_tips_received,
        total_tippers: buy_me_coffee.total_tippers,
    });
}

/// Get the total tips received
public fun total_tips_received(buy_me_coffee: &BuyMeCoffee): u64 {
    buy_me_coffee.total_tips_received
}

/// Get the total number of tippers
public fun total_tippers(buy_me_coffee: &BuyMeCoffee): u64 {
    buy_me_coffee.total_tippers
}

/// Get the creator address
public fun creator(buy_me_coffee: &BuyMeCoffee): address {
    buy_me_coffee.creator
}

/// Get tip count
public fun tip_count(buy_me_coffee: &BuyMeCoffee): u64 {
    vector::length(&buy_me_coffee.tips)
}

/// Get a specific tip (for viewing purposes)
public fun get_tip(buy_me_coffee: &BuyMeCoffee, index: u64): (address, u64, vector<u8>, u64) {
    assert!(index < vector::length(&buy_me_coffee.tips), EInvalidAmount);
    let tip = vector::borrow(&buy_me_coffee.tips, index);
    (tip.sender, tip.amount, *&tip.message, tip.timestamp)
}

// ============ Test-only functions ============

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}

#[test_only]
public fun buy_coffee_for_testing(
    buy_me_coffee: &mut BuyMeCoffee,
    payment: Coin<SUI>,
    message: vector<u8>,
    ctx: &mut TxContext,
) {
    buy_coffee(buy_me_coffee, payment, message, ctx);
}
