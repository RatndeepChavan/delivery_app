# Update packages and their versions.
sudo apt-get update && sudo apt-get upgrade -y

# Install necessary packages:
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

# Install containerd
sudo apt install containerd -y

# Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd

# Download public signing key
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# Note: Releases older than Debian 12 and Ubuntu 22.04, directory does not exist by default use below comand to creat it
# sudo mkdir -p -m 755 /etc/apt/keyrings

# Overwrite any existing configuration
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Update apt package index
sudo apt-get update

# Install kubelet, kubeadm and kubectl
sudo apt-get install -y kubelet kubeadm kubectl

# Pin their version:
sudo apt-mark hold kubelet kubeadm kubectl

# Diasbale swap
sudo swapoff -a

# Disable swap on startup
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Load necessary kernel modules
sudo modprobe overlay
sudo modprobe br_netfilter

# Set required sysctl parameters
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply the changes
sudo sysctl --system
