import { Token } from "../tokens"

it('implements "Optimistic Concurrency Control"', async () => {
    
    const token = Token.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })
    await token.save()

    //fetch the token twice
    const firstInstance = await Token.findById(token.id)
    const secondInstance = await Token.findById(token.id)

    //make two separate changes to the token fetched
    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })

    //save the first fetche token 
    await firstInstance!.save()

    //save the second fetched token & expect an error
    try {
        await secondInstance!.save() 
    } catch (err) {
      return
    }

    throw new Error('Should not reach this point')
})

it('increments the version no. on multiple saves', async () => {
    const token = Token.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })
    
    await token.save()
    expect(token.version).toEqual(0)
    await token.save()
    expect(token.version).toEqual(1)
    await token.save()
    expect(token.version).toEqual(2)
})
