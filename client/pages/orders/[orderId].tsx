import { useEffect, useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from "../../hooks/useRequest"
import Router from "next/router"

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeFLeft = () => {
            const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime()
            setTimeLeft(Math.round(msLeft / 1000))
        }

        findTimeFLeft()
        const timerId = setInterval(findTimeFLeft, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    const content =
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51Mxk3WSGyvNHfcliCdYwBKL1LbgQMOIGsrOz1judLsCYZbgylQZkrw9wYXwkLISTciyMT747jv5SfhwzAAf6LDRC00Bgj1bqHP"
                amount={order.token.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>

    return content
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)

    return { order: data }
}

export default OrderShow