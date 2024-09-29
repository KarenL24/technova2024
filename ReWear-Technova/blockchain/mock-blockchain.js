const mockBlockchain = (() => {
    const orders = {};

    return {
        createOrder: (orderID) => {
            if (!orders[orderID]) {
                orders[orderID] = 0; // Default status: Pending
            } else {
                alert(`Order ${orderID} already exists.`);
            }
        },
        getOrderStatus: (orderID) => {
            return orders[orderID] !== undefined ? orders[orderID] : -1; // Return -1 if not found
        },
        updateOrderStatus: (orderID, status) => {
            if (orders[orderID] !== undefined) {
                orders[orderID] = status; // Update status
            } else {
                alert(`Order ${orderID} not found. Cannot update status.`);
            }
        }
    };
})();

export default mockBlockchain;