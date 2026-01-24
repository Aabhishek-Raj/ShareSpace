JWT_KEY=apfdokdjf
MONGO_URI=mongodb+srv://FirstUser:1234@auth.avap492.mongodb.net/?retryWrites=true&w=majority&appName=auth

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.14.1/deploy/static/provider/cloud/deploy.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.14.1/deploy/static/provider/baremetal/deploy.yaml

code C:\Windows\System32\drivers\etc\hosts

chrome://net-internals/#hsts
> Delete domain security policies > enter domain 'sharespace.local'

or  thisisunsafe



# Deleting
kubectl delete deploy --all
kubectl delete svc --all
kubectl delete pods --all
kubectl delete rs --all

kubectl delete ns ingress-nginx

# To Log
kubectl get pods
kubectl logs <auth-depl-338..>

# Others
To check the connection:
kubectl exec -it auth-depl-695796d4bb-5q5bt -- sh 
wget -qO- http://auth-srv:3000/api/users/currentuser