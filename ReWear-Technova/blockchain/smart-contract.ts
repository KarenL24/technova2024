modules.export = {
    createOrder,
    update_status
}

include::std;

export enum STATE { pending, shipped, delivered }

ledger {
    orderID: Cell[Opaque["string"]];
    shippingStatus: Cell[STATE];
    sender: Cell[Bytes[32]];
    timestamp: Cell[Opaque["string"]];

    constructor() {
        ledger.orderID = none[Opaque["string"]]();
        ledger.shippingStatus = STATE.pending;
        ledger.sender = none[Bytes[32]]();
        ledger.timestamp = none[Opaque["string"]]();
    }
}

witness local_secret_key(): Bytes[32];

export circuit createOrder(orderID: Opaque["string"]): Void {
    ledger.orderID = some[Opaque["string"]](orderID);
    ledger.shippingStatus = STATE.pending;
    ledger.sender = some[Bytes[32]](public_key(local_secret_key(), orderID));
    ledger.timestamp = some[Opaque["string"]](now());
}

export circuit update_status(orderID: Opaque["string"], newStatus: STATE): Void {
    assert(ledger.orderID == some[Opaque["string"]](orderID), "Invalid order ID");
    assert(ledger.sender == some[Bytes[32]](public_key(local_secret_key(), orderID)), "Unauthorized");
    ledger.shippingStatus = newStatus;
}

export circuit get_order_status(orderID: Opaque["string"]): STATE {
    assert(ledger.orderID == some[Opaque["string"]](orderID), "Invalid order ID");
    return ledger.shippingStatus;
}

export circuit public_key(sk: Bytes[32], instance: Opaque["string"]): Bytes[32] {
    return persistent_hash(
        persistent_hash(pad(32, "shipping:pk:"), instance),
        sk
    );
}

// Event definition for status updates
event emit_status_update(orderID: Opaque["string"], newStatus: STATE);
