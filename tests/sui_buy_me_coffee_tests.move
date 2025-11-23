#[test_only]
module sui_buy_me_coffee::sui_buy_me_coffee_tests;

use sui_buy_me_coffee::sui_buy_me_coffee::{Self, BuyMeCoffee};
use sui::test_scenario;
use sui::coin;
use sui::sui::SUI;

const CREATOR: address = @0xCAFE;
const TIPPER1: address = @0x1111;
const TIPPER2: address = @0x2222;

#[test]
fun test_init() {
    let mut scenario = test_scenario::begin(CREATOR);
    
    // Initialize the BuyMeCoffee contract
    sui_buy_me_coffee::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, CREATOR);
    
    // Get the shared object
    let buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Verify initial state
    assert!(sui_buy_me_coffee::creator(&buy_me_coffee) == CREATOR, 0);
    assert!(sui_buy_me_coffee::total_tips_received(&buy_me_coffee) == 0, 1);
    assert!(sui_buy_me_coffee::total_tippers(&buy_me_coffee) == 0, 2);
    assert!(sui_buy_me_coffee::tip_count(&buy_me_coffee) == 0, 3);
    
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::end(scenario);
}

#[test]
fun test_buy_coffee_single_tip() {
    let mut scenario = test_scenario::begin(CREATOR);
    
    // Initialize
    sui_buy_me_coffee::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, CREATOR);
    let mut buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Switch to tipper
    test_scenario::next_tx(&mut scenario, TIPPER1);
    
    // Create a payment coin
    let payment = coin::mint_for_testing<SUI>(1000, test_scenario::ctx(&mut scenario));
    
    // Send tip with message
    let message = b"Great work!";
    sui_buy_me_coffee::buy_coffee_for_testing(
        &mut buy_me_coffee,
        payment,
        message,
        test_scenario::ctx(&mut scenario),
    );
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::next_tx(&mut scenario, TIPPER1);
    
    // Get the object back to verify
    let buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Verify stats
    assert!(sui_buy_me_coffee::total_tips_received(&buy_me_coffee) == 1000, 0);
    assert!(sui_buy_me_coffee::total_tippers(&buy_me_coffee) == 1, 1);
    assert!(sui_buy_me_coffee::tip_count(&buy_me_coffee) == 1, 2);
    
    // Verify tip details
    let (sender, amount, tip_message, _timestamp) = sui_buy_me_coffee::get_tip(&buy_me_coffee, 0);
    assert!(sender == TIPPER1, 3);
    assert!(amount == 1000, 4);
    assert!(tip_message == b"Great work!", 5);
    
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::end(scenario);
}

#[test]
fun test_buy_coffee_multiple_tips() {
    let mut scenario = test_scenario::begin(CREATOR);
    
    // Initialize
    sui_buy_me_coffee::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, CREATOR);
    let mut buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // First tip
    test_scenario::next_tx(&mut scenario, TIPPER1);
    let payment1 = coin::mint_for_testing<SUI>(500, test_scenario::ctx(&mut scenario));
    sui_buy_me_coffee::buy_coffee_for_testing(
        &mut buy_me_coffee,
        payment1,
        b"First tip",
        test_scenario::ctx(&mut scenario),
    );
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::next_tx(&mut scenario, TIPPER1);
    
    // Second tip
    test_scenario::next_tx(&mut scenario, TIPPER2);
    let mut buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    let payment2 = coin::mint_for_testing<SUI>(1500, test_scenario::ctx(&mut scenario));
    sui_buy_me_coffee::buy_coffee_for_testing(
        &mut buy_me_coffee,
        payment2,
        b"Second tip",
        test_scenario::ctx(&mut scenario),
    );
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::next_tx(&mut scenario, TIPPER2);
    
    // Get object back to verify
    let buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Verify cumulative stats
    assert!(sui_buy_me_coffee::total_tips_received(&buy_me_coffee) == 2000, 0);
    assert!(sui_buy_me_coffee::total_tippers(&buy_me_coffee) == 2, 1);
    assert!(sui_buy_me_coffee::tip_count(&buy_me_coffee) == 2, 2);
    
    // Verify first tip
    let (sender1, amount1, _, _) = sui_buy_me_coffee::get_tip(&buy_me_coffee, 0);
    assert!(sender1 == TIPPER1, 3);
    assert!(amount1 == 500, 4);
    
    // Verify second tip
    let (sender2, amount2, _, _) = sui_buy_me_coffee::get_tip(&buy_me_coffee, 1);
    assert!(sender2 == TIPPER2, 5);
    assert!(amount2 == 1500, 6);
    
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = 1)]
fun test_buy_coffee_zero_amount() {
    let mut scenario = test_scenario::begin(CREATOR);
    
    // Initialize
    sui_buy_me_coffee::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, CREATOR);
    let mut buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Switch to tipper
    test_scenario::next_tx(&mut scenario, TIPPER1);
    
    // Try to send zero amount (this should fail)
    let payment = coin::mint_for_testing<SUI>(0, test_scenario::ctx(&mut scenario));
    sui_buy_me_coffee::buy_coffee_for_testing(
        &mut buy_me_coffee,
        payment,
        b"Zero tip",
        test_scenario::ctx(&mut scenario),
    );
    
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = 1)]
fun test_get_tip_invalid_index() {
    let mut scenario = test_scenario::begin(CREATOR);
    
    // Initialize
    sui_buy_me_coffee::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, CREATOR);
    let buy_me_coffee = test_scenario::take_shared<BuyMeCoffee>(&scenario);
    
    // Try to get tip at invalid index
    sui_buy_me_coffee::get_tip(&buy_me_coffee, 0);
    
    test_scenario::return_shared(buy_me_coffee);
    test_scenario::end(scenario);
}
