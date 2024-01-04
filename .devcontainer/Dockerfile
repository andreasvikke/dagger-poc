FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

COPY --from=golang:1.20 /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"

RUN curl -fsSL https://get.docker.com | sh
RUN curl -L https://dl.dagger.io/dagger/install.sh | sh
