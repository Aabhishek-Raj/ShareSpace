import Link from "next/link"

const LandingPage = ({ currentUser, tokens }) => {

  const tokenList = tokens.map(token => {
    return (
      <tr key={token.id}>
        <td>{token.title}</td>
        <td>{token.price}</td>
        <td>
          <Link href="tokens/[tokenId]" as={`tokens/${token.id}`}>View</Link>
        </td>
      </tr>
    )
  })

  const content =
    <div>
      <h1>NFT'S</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tokenList}
        </tbody>
      </table>
    </div>

  return content
}

LandingPage.getInitialProps = async (context, client, currentUser) => {

  const { data } = await client.get('/api/tokens')

  return { tokens: data }
}

export default LandingPage
