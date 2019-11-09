.PHONY: dev
dev:
	yarn parcel serve src/index.html

.PHONY: build
build: clean
	yarn parcel build src/index.html -d docs --public-url /tanya-2019

.PHONY: clean
clean:
	rm -rf dist docs
