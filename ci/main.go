package main

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"os"

	"dagger.io/dagger"
)

func main() {
	ctx := context.Background()

	// initialize Dagger client
	client, err := dagger.Connect(ctx, dagger.WithLogOutput(os.Stderr))
	if err != nil {
		panic(err)
	}
	defer client.Close()

	// use a node:16-slim container
	// mount the source code directory on the host
	// at /src in the container
	source := client.Container().
		From("node:20-slim").
		WithDirectory("/src", client.Host().Directory(".", dagger.HostDirectoryOpts{
			Exclude: []string{"node_modules/", "ci/", "build/", "dist/", ".devcontainer/"},
		}))

		// set the working directory in the container
		// install application dependencies
	runner := source.WithWorkdir("/src").
		WithExec([]string{"npm", "install"})

		// run application tests
	test := runner.WithExec([]string{"npm", "test", "--", "--watchAll=false"})

	// first stage
	// build application
	buildDir := test.WithExec([]string{"npm", "run", "build"}).
		Directory(".")

	// second stage
    // build using Dockerfile
    // publish the resulting container to a registry
	ref, err := buildDir.
		DockerBuild().
		Publish(ctx, fmt.Sprintf("ttl.sh/hello-dagger-%.0f", math.Floor(rand.Float64()*10000000))) //#nosec
	if err != nil {
		panic(err)
	}

	fmt.Printf("Published image to: %s\n", ref)
}