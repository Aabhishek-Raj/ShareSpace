import buildClient from '../api/buildClient'

const LandingPage = ({ currentUser }) => {

  const content = currentUser ? <h1>You are Signed in.</h1>: <h1>You are Not Signed in..</h1>

  return content
}

LandingPage.getInitialProps = async (context) => {

  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data 
}

export default LandingPage
