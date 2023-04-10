import axios from "axios"

export default ({ req }) => {

    if(typeof window === 'undefined') {
        //on Server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else{
        //on Browser
        return axios.create({
            baseURL: '/'
        })
    }
}