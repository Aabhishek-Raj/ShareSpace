const OrderIndex = ({ orders }) => {
    const content = 
        <ul>
            {orders.map(order => (
                <li key={order.id}>{ order.token.title} - {order.status}</li>
            ))}
        </ul>
    return content
}

OrderIndex.getInitialProp = async (context, client) => {
    const { data } = await client.get('/api/orders')

    return { orders: data }
}

export default OrderIndex