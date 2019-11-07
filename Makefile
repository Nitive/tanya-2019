.PHONY: dev
dev:
	yarn parcel serve src/index.html

.PHONY: build
build:
	yarn parcel build src/index.html -d docs --public-url /tanya-2019
