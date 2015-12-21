.PHONY: build start start-detached stop-detached test lint check-coverage

build:
	docker build -t unoconv-worker-dev .

start: build
	docker run -p 3121:3121 -it --rm --name unoconv-worker-dev unoconv-worker-dev

start-detached: build
	docker run -p 3121:3121 -d --name unoconv-worker-detached unoconv-worker-dev && sleep 2

stop-detached:
	docker stop unoconv-worker-detached && docker rm unoconv-worker-detached

test: start-detached
	mocha test/integration.js ; make stop-detached

benchmark: start-detached
	rm -rf benchmark-results ; mkdir benchmark-results ; node test/benchmark.js ; make stop-detached

lint:
	jscs -v . ; jshint .
