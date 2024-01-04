import { connect } from "@dagger.io/dagger"

connect(
  async (client) => {
    // use a node:16-slim container
    // mount the source code directory on the host
    // at /src in the container
    const source = client
      .container()
      .from("node:20-slim")
      .withDirectory("/src", client.host().directory(".", {
        exclude: ["node_modules/", "ci/", "build/", "dist/", ".devcontainer/"],
      }))

    // set the working directory in the container
    // install application dependencies
    const runner = source.withWorkdir("/src").withExec(["npm", "install"])

    // run application tests
    const test = runner.withExec(["npm", "test", "--", "--watchAll=false"])

    // first stage
    // build application
    const buildDir = test.withExec(["npm", "run", "build"]).directory(".")

    // second stage
    // build using Dockerfile
    // publish the resulting container to a registry
    const imageRef = await buildDir
        .dockerBuild()
        .publish('ttl.sh/test-dagger-' + Math.floor(Math.random() * 10000000))
    console.log(`Published image to: ${imageRef}`)
  },
  { LogOutput: process.stderr }
)