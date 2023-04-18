import Router from "next/router"
import useRequest from "../../hooks/useRequest"

const TokenShow = ({ token }) => {
     const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            tokenId: token.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
     })

    const content = 
        <div>
            <h1>{ token.title}</h1>
            <h4>Price: {token.price}</h4>
            {errors}
            <button onClick={() => doRequest} className="btn-btn-primary">Purchase</button>
        </div>

    return content
}

TokenShow.getInitialProps = async (context, client) => {
    const { tokenId } = context.query
    const { data } = await client.get(`/api/tokens/${tokenId}`)

    return { token: data }
}

export default TokenShow