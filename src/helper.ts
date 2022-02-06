import * as https from "https";

// fetch-like request
let httpReqest = async (options, payload) => {
    try {
        let reqBody = JSON.stringify(payload)
        let req = (options, payload) => {
            return new Promise<any>((resolve, rejects) => {
                let req = https.request(options, (res) => {
                    let body: Array<any> = [];
    
                    res.on('data', (chunk) => {
                        body.push(chunk)
                    });
                    res.on('end', () => {                        
                        let bodySting : string = Buffer.concat(body).toString();        
                        resolve(bodySting)
                    });
                })
    
                req.on('error', error => {
                    console.error(error)
                    rejects(error)
                })
    
                req.write(payload);
                req.end()
            })
        }
        const answer = await req(options, reqBody);
        return answer   
    } catch(err) {
        throw err
    }
}

export = httpReqest
