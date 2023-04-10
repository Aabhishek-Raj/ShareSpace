import { FormEvent, useState } from "react"
import Router from 'next/router'
import useRequest from "../../hooks/useRequest"

export default () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin', 
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    })


    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        doRequest()
    }

    const content =
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </form>

    return content
}