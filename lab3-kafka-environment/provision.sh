# Prepare Environment Variables
export PUBLIC_IP=$(curl ipinfo.io/ip)
#export DOCKER_HOST_IP=$(ip addr show ens33 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)

shutdown now -h