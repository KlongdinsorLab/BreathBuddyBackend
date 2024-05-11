Deno.serve(async (req) => {
    const {url, method} = req

    console.log(url)

    const taskPattern = new URLPattern({pathname: '/game/:id'})
    const matchingPath = taskPattern.exec(url)
    const id = matchingPath ? matchingPath.pathname.groups.id : null

    console.log('id', id)

    console.log('method', method)

    const {name, cat} = await req.json()
    const data = {
        message: `Hello ${name}! ${cat}`,
    }

    return new Response(
        JSON.stringify(data),
        {headers: {"Content-Type": "application/json"}},
    )
})
