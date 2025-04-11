include .env
export $(shell sed 's/=.*//' .env)

DEV_S3_BUCKET_NAME = admin.staging-bridge.tari.com
DEV_DISTRIBUTION_ID = E30RD7TH79WLJL

.PHONY: build deploy-dev

build:
	npm run build

deploy-dev:
	aws s3 sync dist s3://${DEV_S3_BUCKET_NAME} --delete --exact-timestamps
	aws cloudfront create-invalidation --distribution-id ${DEV_DISTRIBUTION_ID} --paths "/*"
