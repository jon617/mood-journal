docker pull planetscale/pscale:latest
alias pscale="docker run -e HOME=/tmp -v $HOME/.config/planetscale:/tmp/.config/planetscale --user $(id -u):$(id -g) --rm -it -p 3306:3306/tcp planetscale/pscale:latest"
pscale connect mood dev --host 0.0.0.0 --port 3306
