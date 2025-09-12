# Run kubeadm init command with desired pod network CIDR.
# 10.244.0.0/16 -> Flannel CNI refer below link:
# https://gist.github.com/rkaramandi/44c7cea91501e735ea99e356e9ae7883#:~:text=%2D%2Dpod%2Dnetwork%2Dcidr%3D10.244.0.0/16%20option%20is%20a%20requirement%20for%20Flannel%20%2D%20don%27t%20change%20that%20network%20address! 
# ?Why flannel -> google: lightweight CNI for k8s
# --ignore-preflight-errors=NumCPU,Mem : for free tier ec2
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=NumCPU,Mem

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Alternatively you can use 
# export KUBECONFIG=/etc/kubernetes/admin.conf

# Installing CNI Plugin
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# If you get permission error for flannel then run below command
# sudo chown $(id -u):$(id -g) /etc/kubernetes/admin.conf
# ?If you export admin.conf then you might need to run above command 

# Generate and print joining token to add workers
# kubeadm token create --print-join-command

# Get live status of newly join worker
# watch kubectl get pods -n kube-flannel
