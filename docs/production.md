Updating the Image used by a Deployment - method 2

1) The deployment must be using the 'latest' tag in the the pod spec section
2) Make an update to your code
3) Build the image
4) Push the image to docker hub 
5) Kubectl rollout restart deployment[depl_name]